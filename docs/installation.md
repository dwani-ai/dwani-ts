Installation

- nodejs 
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22

node -v # Should print "v22.16.0".
nvm current # Should print "v22.16.0".
npm -v # Should print "10.9.2".
```