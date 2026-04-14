def analisar_processo(processo):
    return {
        "fatos": f"Trata-se de ação de {processo['pedido']} entre {processo['partes']['autor']} e {processo['partes']['reu']}.",
        "pedido": processo["pedido"],
        "resumo": "Demanda típica de direito de família."
    }
