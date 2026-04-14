#!/usr/bin/env bash

set -e

echo "🚀 Instalando Lav-nIA..."

# Diretório de instalação
INSTALL_DIR="$HOME/.lavnia"

echo "📁 Criando pasta..."
mkdir -p $INSTALL_DIR

echo "📥 Baixando projeto..."
git clone https://github.com/laviniavitoria2/Lav-nIA.git $INSTALL_DIR

echo "📦 Instalando dependências..."
pip install -r $INSTALL_DIR/requirements.txt

echo "⚙️ Criando comando global..."

echo '#!/usr/bin/env bash' > /usr/local/bin/lavnia
echo "python3 $INSTALL_DIR/lavnia/cli.py" >> /usr/local/bin/lavnia

chmod +x /usr/local/bin/lavnia

echo "✅ Instalação concluída!"
echo "Digite: lavnia"

#!/usr/bin/env bash

set -e

echo "🚀 Instalando Lav-nIA..."

INSTALL_DIR="$HOME/.lavnia"
BIN_PATH="/usr/local/bin/lavnia"

# 🔐 Verifica dependências
echo "🔍 Verificando dependências..."

command -v git >/dev/null 2>&1 || { echo "❌ Git não instalado"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python3 não instalado"; exit 1; }
command -v pip >/dev/null 2>&1 || { echo "❌ Pip não instalado"; exit 1; }

# 📁 Criar pasta
echo "📁 Criando diretório..."
mkdir -p $INSTALL_DIR

# 📥 Clonar ou atualizar
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "🔄 Atualizando projeto..."
    cd $INSTALL_DIR && git pull
else
    echo "📦 Baixando projeto..."
    git clone https://github.com/laviniavitoria2/Lav-nIA.git $INSTALL_DIR
fi

# 📦 Instalar dependências
echo "📦 Instalando dependências..."
pip install -r $INSTALL_DIR/requirements.txt

# ⚙️ Criar comando global
echo "⚙️ Criando comando global..."

sudo tee $BIN_PATH > /dev/null <<EOF
#!/usr/bin/env bash
python3 $INSTALL_DIR/cli.py
sudo chmod +x $BIN_PATH

# 🎉 Final
echo "✅ Lav-nIA instalado com sucesso!"
echo "👉 Digite: lavni