import sys
import argparse

VERSION = "1.0.0"

def banner():
    print("\n⚖️ Lav-nIA - Sistema Jurídico Inteligente")
    print(f"Versão: {VERSION}")
    print("========================================\n")


def chat():
    print("💬 Modo chat jurídico iniciado...")
    print("Digite 'sair' para encerrar.\n")

    while True:
        msg = input("lav-nia> ")

        if msg.lower() in ["sair", "exit", "quit"]:
            print("Encerrando chat jurídico...")
            break

        # Simulação de resposta (IA futura entra aqui)
        print(f"\n🧠 Analisando: {msg}")
        print("📄 Resposta simulada: Caso recebido e processado pelo motor jurídico.\n")


def analisar_caso():
    print("⚖️ Modo análise de caso ativado...\n")

    caso = input("Descreva o caso: ")

    print("\n🔍 Processando caso jurídico...")
    print(f"📌 Caso: {caso}")
    print("🧠 Classificação: Direito Civil (simulado)")
    print("📚 Sugestão: Ação de obrigação de fazer ou indenização")
    print("⚖️ Base legal: CC art. 186 e 927 (simulado)")
    print("📄 Status: Pronto para geração de peça\n")


def gerar_peticao():
    print("📄 Gerador de petição iniciado...\n")

    tipo = input("Tipo de ação (ex: indenização, cobrança, obrigação de fazer): ")
    fatos = input("Resumo dos fatos: ")

    print("\n🧠 Gerando peça jurídica...\n")

    print("========================================")
    print("              PETIÇÃO INICIAL          ")
    print("========================================\n")

    print("DOS FATOS")
    print(fatos + "\n")

    print("DO DIREITO")
    print("Com base no Código Civil, especialmente arts. 186 e 927...\n")

    print("DOS PEDIDOS")
    print("Requer a procedência da ação de " + tipo + ".\n")

    print("========================================")
    print("📄 Documento gerado com sucesso (simulado)")
    print("========================================\n")


def menu():
    banner()

    parser = argparse.ArgumentParser(description="Lav-nIA CLI")
    parser.add_argument("command", nargs="?", help="Comando: chat, caso, peticao")

    args = parser.parse_args()

    if args.command == "chat":
        chat()
    elif args.command == "caso":
        analisar_caso()
    elif args.command == "peticao":
        gerar_peticao()
    else:
        print("⚙️ Comandos disponíveis:")
        print("  lavnia chat")
        print("  lavnia caso")
        print("  lavnia peticao\n")


if __name__ == "__main__":
    menu()