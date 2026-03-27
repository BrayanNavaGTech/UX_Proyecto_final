````markdown
## Instalación y ejecución del proyecto

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Instalar dependencias

```bash
pnpm install
````

### 2. Ejecutar el proyecto

```bash
pnpm run dev
```

### 3. Configurar variables de entorno

Después de ejecutar el proyecto por primera vez, se creará un archivo llamado `.env.local`.

Abre ese archivo y agrega lo siguiente:

```bash
# Convex environment variables for development
CONVEX_DEPLOYMENT=dev:lovely-orca-262 # team: brayan-nava
NEXT_PUBLIC_CONVEX_URL=https://lovely-orca-262.convex.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://lovely-orca-262.convex.site
```

### 4. Reiniciar el proyecto

Si el error persiste, detén el proyecto (`Ctrl + C`) y vuelve a ejecutarlo:

```bash
pnpm run dev
```
