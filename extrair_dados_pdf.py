import PyPDF2
import pandas as pd
from io import BytesIO

nome_arquivo = ''

def extrair_dados(file_content, senha):
    pdf_content = BytesIO(file_content)

    try:
        leitor = PyPDF2.PdfReader(pdf_content)

        if leitor.is_encrypted:
            leitor.decrypt(senha)

        npaginas = len(leitor.pages)
        texto = ''

        for npagina in range(npaginas):
            pagina = leitor.pages[npagina]
            texto += pagina.extract_text()
    except Exception as e:
        print(f"Erro ao processar o PDF: {e}")
        return None

    tratar_dados(texto)


def tratar_dados(texto):
    linhas = texto.split('\n')
    dados_tratados = []
    novo_registro = []

    validacao = False
    contador = 0
    global nome_arquivo

    for linha in linhas:
        if "NOTA DE NEGOCIAÇÃO" in linha:
            validacao = True
            contador = 0
        if (validacao and contador == 2) or (validacao and contador == 6) or (validacao and contador == 7):
            if nome_arquivo:
                nome_arquivo += '_' + linha
            else:
                nome_arquivo += 'data_' + linha
        if validacao and contador > 7:
            break
        contador += 1
    print(nome_arquivo)

    for linha in linhas:
        if '1-BOVESPA' in linha:
            if novo_registro:
                dados_tratados.append(novo_registro)
            novo_registro = [linha]
        elif novo_registro:
            if len(novo_registro) == 1:
                novo_registro.append(linha.strip())
            else:
                if novo_registro[-1].isdigit() and len(linha.split()) > 1:
                    novo_registro.extend(linha.split())
                else:
                    novo_registro.append(linha.strip())

    if novo_registro:
        dados_tratados.append(novo_registro)

    dados_quase_finais = []
    observacoes_possiveis = ['A', 'T', 'C', 'I', '#', '#2', 'P', '8', 'H', 'D', 'X', 'F', 'Y', 'B', 'L']
    dados_ajustados = []

    for idx, registro in enumerate(dados_tratados):
        for indice, item in enumerate(registro):
            if item == 'NOTA DE NEGOCIAÇÃO':
                registro = registro[:indice]
                break

        if idx < (len(dados_tratados) - 1):
            if all(len(item) < 100 for item in registro):
                if len(''.join(registro)) > 100:
                    dados_ajustados.append(registro[:9])
                else:
                    dados_ajustados.append(registro)
            else:
                ultimo_registro = registro[:21]
                dados_ajustados.append(ultimo_registro)
        else:
            if any(len(item) > 100 for item in registro):
                ultima_linha = [registro[0][122:]] + registro[1:8]
                dados_ajustados.append(ultima_linha)
            else:
                dados_ajustados.append(registro[:11])
    dados_quase_finais = dados_ajustados

    registros_ajustados = []
    dados_finais = []

    for registro in dados_quase_finais:
        registro.insert(0, '')
        registro.insert(4, '')
        if registro[6] in observacoes_possiveis or registro[7] in observacoes_possiveis or registro[
            8] in observacoes_possiveis:
            if len(registro) > 11:
                while True:
                    ajuste_necessario = False
                    if len(registro) > 11:
                        elemento_removido = registro.pop(6)
                        registro[5] += ' ' + elemento_removido
                        ajuste_necessario = True
                    if not ajuste_necessario:
                        break
            registros_ajustados.append(registro)
        else:
            if len(registro) > 10:
                while True:
                    ajuste_necessario = False
                    if len(registro) > 10:
                        elemento_removido = registro.pop(6)
                        registro[5] += ' ' + elemento_removido
                        ajuste_necessario = True
                    if not ajuste_necessario:
                        break
            registro.insert(6, '')
            registros_ajustados.append(registro)
    dados_finais = registros_ajustados

    for registro in dados_finais:
        print(registro)

    salvar_no_excel(dados_finais,
                    ['Q', 'Negociação', 'C/V', 'Tipo mercado', 'Prazo', 'Especificação do título', 'Obs. (*)',
                     'Quantidade', 'Preço / Ajuste', 'Valor Operação / Ajuste', 'D/C'], nome_arquivo)


def salvar_no_excel(data, columns, file_name_prefix):
    nome_tratado = file_name_prefix.replace('/', '-').replace(',', ' ').replace('.', '-')
    file_name = f"{nome_tratado}.xlsx"

    # Cria o DataFrame e salva no arquivo Excel
    df = pd.DataFrame(data, columns=columns)
    df.to_excel(file_name, index=False)

    print(f'Dados salvos com sucesso!')
