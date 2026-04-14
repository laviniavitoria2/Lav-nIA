import sys
from modules.peticao import gerar_peticao
from modules.chat import chat

def main():
    comando = sys.argv[1] if len(sys.argv) > 1 else "help"

    if comando == "chat":
        chat()

    elif comando == "peticao":
        dados = input("Descreva o caso: ")
        resultado = gerar_peticao(dados)
        print("\n📄 PETIÇÃO:\n")
        print(resultado)

    elif comando == "help":
        print("""
        Comandos disponíveis:

        lavnia chat
        lavnia peticao
        lavnia app
        """)

    else:
        print("Comando não reconhecido")

if __name__ == "__main__":
    main()