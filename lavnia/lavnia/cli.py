import sys
from lavnia.modules.chat import chat
from lavnia.modules.peticao import gerar_peticao

def main():
    comando = sys.argv[1] if len(sys.argv) > 1 else "help"

    if comando == "chat":
        chat()

    elif comando == "peticao":
        texto = input("Descreva o caso: ")
        print(gerar_peticao(texto))

    elif comando == "help":
        print("""
Comandos:
lavnia chat
lavnia peticao
        """)

    else:
        print("Comando inválido")

if __name__ == "__main__":
    main()