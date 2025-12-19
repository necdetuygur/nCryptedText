# nCryptedText

## Environment Variables

The application supports environment variables via a `.env` file.

### `.env` example

```env
PORT=3000
```

If `.env` is not provided, the application defaults to port 3000.

## Running with Docker Compose

### Start the application

```sh
git clone git@github.com:necdetuygur/nCryptedText.git
cd nCryptedText
docker compose up -d
```

### Stop the application

```sh
docker compose down
```

## Running Locally (Without Docker)

```sh
git clone git@github.com:necdetuygur/nCryptedText.git
cd nCryptedText
npm install
npm start
```

Or directly:

```sh
node index.js
```

Then open:

```
http://localhost:3000
```

## License

MIT License
