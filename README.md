# 🚀 Instalación y ejecución del proyecto

# 1. Instalar dependencias
pnpm install

# 2. Ejecutar el proyecto
pnpm run dev

# 3. Configurar variables de entorno
# Después de ejecutar el proyecto por primera vez, se creará el archivo .env.local
# Abre ese archivo y agrega lo siguiente:

# Convex environment variables for development
CONVEX_DEPLOYMENT=dev:lovely-orca-262 # team: brayan-nava
NEXT_PUBLIC_CONVEX_URL=https://lovely-orca-262.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://lovely-orca-262.convex.site

# 4. Si el error persiste:
# Detén el proyecto (Ctrl + C) y vuelve a ejecutarlo
pnpm run dev
