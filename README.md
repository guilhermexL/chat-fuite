# Chat Fuite - Java Swing Edition

Um pequeno jogo feito em Java utilizando Swing, onde o objetivo é **impedir que o gato fuja do tabuleiro**. Você clica nos círculos para criar obstáculos e tentar cercar o gato antes que ele alcance a borda!

---

### Como funciona?

* O tabuleiro é formado por círculos (células).
* Um gato começa no centro.
* A cada rodada, o jogador clica em uma célula para bloqueá-la.
* O gato se move automaticamente tentando encontrar a saída mais próxima.
* O jogo termina quando:

  * ✅ O jogador cerca o gato (vitória).
  * ❌ O gato escapa pelo canto do tabuleiro (derrota).

---

### Tecnologias utilizadas

* **Java 17+** (ou compatível)
* **Swing** (interface gráfica)
* Algoritmos de pathfinding (ex: BFS para movimentação do gato)

---

### Como rodar o projeto

1. **Clone este repositório:**

   ```bash
   git clone https://github.com/guilhermexL/chat-fuite.git
   cd chat-fuite
   ```

2. **Compile o projeto:**

   * Usando terminal:

     ```bash
     javac src/**/*.java
     ```

3. **Execute o jogo:**

   ```bash
   java -cp src Main
   ```
> [!NOTE]
> Certifique-se de que o `Main.java` está configurado corretamente como classe principal.

---

### Próximos passos

* [ ] Criar interface gráfica com círculos clicáveis.
* [ ] Implementar movimentação automática do gato.
* [ ] Adicionar condição de vitória/derrota.
* [ ] Melhorar design com cores e efeitos visuais.

---

### Autor

Desenvolvido por [Guilherme Santos](https://linkedin.com/in/guilhermee-santos).
