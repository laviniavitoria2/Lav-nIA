from lavnia.core.ai import responder

def chat():
    while True:
        msg = input("Você: ")

        if msg == "sair":
            break

        print("IA:", responder(msg))