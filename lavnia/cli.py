import sys
from lavnia.modules.chat import chat
from lavnia.modules.peticao import gerar_peticao

def main():
    if len(sys.argv) < 2:
        print("Use: lavnia [chat|peticao]")
        return

    comando = sys.argv[1]

    if comando == "chat":
        chat()

    elif comando == "peticao":
        texto = input("Descreva o caso: ")
        print(gerar_peticao(texto))

    else:
        print("Comando inválido")

if __name__ == "__main__":
    main()