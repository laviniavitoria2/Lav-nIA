from core.processo import carregar_processo
from core.nulidades import verificar_nulidades
from core.analise import analisar_processo
from core.minutador import gerar_sentenca
from interface.dashboard import render_dashboard

def main():
    processo = carregar_processo()
    alertas, riscos = verificar_nulidades(processo)
    analise = analisar_processo(processo)
    sentenca = gerar_sentenca(processo, analise, alertas)

    render_dashboard(processo, analise, alertas, riscos, sentenca)

if __name__ == "__main__":
    main()
