def verificar_nulidades(processo):
    alertas = []
    riscos = []

    if not processo["status"].get("citacao", False):
        alertas.append("❌ Ausência de citação válida (Art. 239 CPC)")

    if processo.get("vara") == "Vara de Família" and not processo.get("mp_intervencao"):
        alertas.append("❌ Falta de intervenção do MP (Art. 178 CPC)")

    if processo.get("decisao_surpresa"):
        alertas.append("❌ Decisão surpresa (Art. 10 CPC)")

    if processo.get("fundamentacao_generica"):
        riscos.append("⚠️ Fundamentação genérica (Art. 489 CPC)")

    if processo.get("valor_causa", 0) <= 20000:
        riscos.append("⚠️ Possível competência do Juizado Especial")

    return alertas, riscos
