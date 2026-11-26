# Mentes en Acción

Create a Spanish-language educational web game called "¿Cuánto sabes sobre las teorías del aprendizaje?".

Educational purpose:
The game is designed for students studying Educational Psychology. Its purpose is to help them identify and distinguish five major learning theories:

Conductismo

Cognitivismo

Procesamiento de la información

Constructivismo

Humanismo

Core gameplay:
Create an interactive drag-and-drop classification game.

Display five clearly labeled category areas, one for each learning theory.

Display a collection of cards containing descriptions of the theories.

The player must drag each card into the correct category.

Each card must have one clearly defined correct answer.

Include 25 cards in total, with five cards per category.

Shuffle the cards at the beginning of each game.

Allow players to move cards between categories before submitting them.

Provide immediate visual feedback when a card is dropped into a category.

Correct answers should receive positive visual feedback and points.

Incorrect answers should display a helpful explanation and allow the player to try again.

Do not permanently lock incorrect answers.

Track the number of correctly classified cards and the player's score.

Game interface:

Create an attractive, modern educational interface.

Use a friendly academic visual style, with five distinguishable colors for the categories.

Make the layout responsive for desktop, tablet and mobile.

Use clear typography and readable card sizes.

Include a welcome screen with the game title, instructions and a Start Game button.

Include a progress bar.

Include a final results screen showing total score, percentage of correct answers and a short performance message.

Include a Play Again button.

Educational feedback:
When a player makes a mistake, explain why the selected category is incorrect and identify the theoretical concept that makes the correct category appropriate.

Pay special attention to distinguishing Cognitivism from Information Processing Theory. They are related, but should have separate categories and carefully written descriptions.

Technical requirements:

Build this as a frontend-only application.

Use React and TypeScript.

Use functional components and maintainable code.

Implement drag-and-drop functionality reliably.

Keep all game content in a separate structured data file so questions can be edited easily.

Save the current game progress locally so accidental page refreshes do not erase it.

Do not require user registration, an external database, API keys or paid services.

Ensure all game mechanics work without a backend.

First create the complete interface and implement the core game mechanics. Do not add unnecessary features or external integrations.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f0585080-d5b9-4e6a-aa13-aa404a40cdc5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
