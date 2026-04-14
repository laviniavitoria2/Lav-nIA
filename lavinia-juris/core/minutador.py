def gerar_sentenca(processo, analise, alertas):
    texto = f"""
SENTENÇA

Processo: {processo['numero']}

I - RELATÓRIO
{analise['fatos']}

II - FUNDAMENTAÇÃO
"""

    if alertas:
        texto += "\nATENÇÃO: Possíveis nulidades identificadas.\n"

    texto += """
Análise realizada conforme o CPC e jurisprudência aplicável.

III - DISPOSITIVO

Julgo procedente o pedido.

Publique-se. Registre-se. Intimem-se.
"""

    return texto
