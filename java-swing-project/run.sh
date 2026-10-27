#!/bin/bash
echo "=================================================="
echo "  Lancement de Hotel de Reve - Java Swing Desktop"
echo "=================================================="

if command -v mvn &> /dev/null; then
    mvn compile exec:java
else
    echo "Maven n'est pas installe. Installez maven ou utilisez l'extension Java de VS Code."
fi
