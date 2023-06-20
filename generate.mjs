import fs from 'fs';

// Générer une clé aléatoire de 32 octets (256 bits) avec des lettres majuscules et minuscules
function generateRandomKey() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 64; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    key += characters[randomIndex];
  }
  return key;
}

// Chemin vers le fichier .env
const envFilePath = '.env';

// Vérifier si le fichier .env existe
const envFileExists = fs.existsSync(envFilePath);

// Lire le contenu actuel du fichier .env
let envContent = '';
if (envFileExists) {
  envContent = fs.readFileSync(envFilePath, 'utf8');
}

// Générer les nouvelles clés
const keys = {
  KEY: generateRandomKey(),
  JWT_SECRET: generateRandomKey(),
  JWT_REFRESH_SECRET: generateRandomKey(),
};

// Mettre à jour le contenu du fichier .env avec les nouvelles clés
Object.entries(keys).forEach(([keyName, keyValue]) => {
  // Remplacer la clé existante si elle est présente
  const regex = new RegExp(`${keyName}=(.+)`);
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${keyName}=${keyValue}`);
  } else {
    // Ajouter la nouvelle clé à la fin du fichier
    envContent += `${keyName}=${keyValue}\n`;
  }
});

// Écrire le contenu mis à jour dans le fichier .env
fs.writeFileSync(envFilePath, envContent);

console.log('Keys generated successfully');
