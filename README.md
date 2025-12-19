# Lucky Wave Chronicles: A Casino Story

An interactive visual novel game set in a luxurious casino environment. Built with vanilla JavaScript, HTML5, and CSS3.

## Features

- 🎰 **Casino Mini-Games**: Blackjack, Slots, and Poker
- 📖 **Visual Novel Engine**: Branching storylines with choices
- 💰 **Inventory System**: Track keys, tickets, and money
- 🏆 **Achievements**: Unlock achievements as you progress
- 💾 **Save System**: Save and load your progress
- 📱 **Mobile Responsive**: Optimized for iPhone and mobile devices
- 🎨 **Beautiful UI**: Fixed header with inventory, elegant design

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Storage**: LocalStorage for game saves
- **Deployment**: Vercel (static hosting)

## Local Development

### Prerequisites

- Node.js (optional, for local server)
- Modern web browser

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/grinevoleg/luckywavecasino.git
cd luckywavecasino
```

2. Start a local server:
```bash
npm start
# or
python3 -m http.server 8080
```

3. Open `http://localhost:8080` in your browser

## Deployment

### Deploy on DigitalOcean App Platform (Recommended)

#### Option 1: Deploy via GitHub Integration

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Select "GitHub" as the source
4. Authorize DigitalOcean to access your GitHub account
5. Select the repository `grinevoleg/luckywavecasino`
6. Select the branch `main`
7. DigitalOcean will detect it's a static site from `.do/app.yaml`
8. Review the configuration (should auto-detect static site)
9. Click "Create Resources"
10. Your app will be deployed and available at `https://your-app-name.ondigitalocean.app`

#### Option 2: Deploy via DigitalOcean CLI

1. Install `doctl`:
```bash
# macOS
brew install doctl

# Or download from https://github.com/digitalocean/doctl/releases
```

2. Authenticate:
```bash
doctl auth init
```

3. Deploy:
```bash
doctl apps create --spec .do/app.yaml
```

#### Configuration

The project includes `.do/app.yaml` with the following settings:
- Static site configuration
- SPA routing (all routes redirect to `index.html`)
- Auto-deploy on push to main branch
- Health check endpoint

### Deploy on Vercel (Alternative)

The project also includes `vercel.json` for Vercel deployment:

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import the repository `grinevoleg/luckywavecasino`
4. Vercel will automatically detect the configuration
5. Click "Deploy"

## Project Structure

```
├── assets/          # Images and media files
├── css/             # Stylesheets
│   ├── main.css     # Main styles
│   ├── novel.css    # Visual novel styles
│   ├── casino.css   # Mini-game styles
│   ├── inventory.css # Inventory styles
│   └── mobile.css   # Mobile responsive styles
├── js/              # JavaScript modules
│   ├── main.js      # Main game logic
│   ├── novel-engine.js # Visual novel engine
│   ├── story-data.js # Story content
│   ├── casino-games.js # Mini-games
│   ├── inventory.js # Inventory system
│   ├── achievements.js # Achievements
│   └── ...
├── index.html       # Main HTML file
├── vercel.json      # Vercel configuration
└── package.json     # Node.js dependencies
```

## Game Features

### Visual Novel System
- Multiple scenes with backgrounds and characters
- Dialogue system with character portraits
- Branching storylines based on player choices
- Scene transitions and character animations

### Mini-Games
- **Blackjack**: Classic card game
- **Slots**: Slot machine with jackpot system
- **Poker**: Poker tournament

### Inventory & Resources
- **Keys**: Unlock special areas
- **Tickets**: Access premium content
- **Money**: Currency for transactions

### Achievements
Track your progress with various achievements:
- First Win
- Blackjack Master
- Jackpot Winner
- Poker Champion
- And more...

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created by grinevoleg

## Links

- **GitHub**: https://github.com/grinevoleg/luckywavecasino
- **Live Demo**: (Deploy to Vercel to get your live URL)
