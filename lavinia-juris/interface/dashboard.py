import streamlit as st

def render_dashboard(processo, analise, alertas, riscos, sentenca):
    st.set_page_config(page_title="LavinIA Juris", layout="wide")

    st.title("⚖️ LavinIA Juris — Painel de Gabinete")

    st.sidebar.title("Menu")
    opcao = st.sidebar.radio("Navegação", [
        "Visão Geral",
        "Nulidades",
        "Análise",
        "Sentença"
    ])

    if opcao == "Visão Geral":
        st.subheader("📁 Processo")
        st.json(processo)

    elif opcao == "Nulidades":
        st.subheader("⚠️ Alertas")
        for a in alertas:
            st.error(a)

        st.subheader("⚠️ Riscos")
        for r in riscos:
            st.warning(r)

    elif opcao == "Análise":
        st.subheader("🧠 Resumo")
        st.write(analise)

    elif opcao == "Sentença":
        st.subheader("🧾 Minuta")
        st.code(sentenca)
