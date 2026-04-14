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
echo "python3 $INSTALL_DIR/app.py" >> /usr/local/bin/lavnia

chmod +x /usr/local/bin/lavnia

echo "✅ Instalação concluída!"
echo "Digite: lavnia"