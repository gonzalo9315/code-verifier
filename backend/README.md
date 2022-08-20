# code-verifier-backend

Node Express project for backend

## Depencias

- [ ] **cors -** permite que se puedan solicitar recursos restringidos en una página web desde un dominio diferente del dominio que sirvió el primer recurso
- [ ] **dotenv -** carga variables de entorno desde un .env archivo
- [ ] **express -** framework minimalista de node
- [ ] **helmet -** ayuda a proteger aplicaciones Express configurando varios encabezados HTTP
- [ ] **mongoose -** herramienta de modelado de objetos, admite tanto promesas como devoluciones de llamada. 
- [ ] **@types/cors -** definiciones de tipo para Cors
- [ ] **@types/express -** definiciones de tipo para Express
- [ ] **@types/jest -** definiciones de tipo para Jest
- [ ] **@types/node -** definiciones de tipo para Node
- [ ] **@typescript-eslint/eslint-plugin -** El complemento ESLint envuelve una configuración de TSLint y filtra toda la fuente usando TSLint
- [ ] **@typescript-eslint/parser -** Un analizador de ESLint que aprovecha TypeScript ESTree para permitir que ESLint borre el código fuente de TypeScript
- [ ] **concurrently -** ejecutar varios comandos al mismo tiempo
- [ ] **eslint -** herramienta para identificar e informar sobre patrones encontrados en el código ECMAScript/JavaScript
- [ ] **eslint-config-standard -** configuración estandar para ESLint
- [ ] **eslint-plugin-import -** admitir la eliminación de pelusa de la sintaxis de importación/exportación de ES2015+ (ES6+) y evitar problemas con la ortografía incorrecta de las rutas de archivo y los nombres de importación
- [ ] **eslint-plugin-node -** reglas adicionales de ESLint para Node.js 
- [ ] **eslint-plugin-promise -** Aplicar las mejores prácticas para las promesas de JavaScript
- [ ] **jest -** framework de pruebas para JavaScript
- [ ] **nodemon -** herramienta que ayuda a desarrollar aplicaciones basadas en node.js al reiniciar automáticamente la aplicación del nodo cuando se detectan cambios en los archivos del directorio. 
- [ ] **serve -** servicio de archivos estáticos y listado de directorios 
- [ ] **supertest -** biblioteca impulsada por SuperAgent para probar servidores HTTP 
- [ ] **ts-jest -** transformador Jest con compatibilidad con mapas de origen que le permite usar Jest para probar proyectos escritos en TypeScript 
- [ ] **ts-node -** entorno de ejecución de TypeScript y REPL para node.js, con compatibilidad con mapas de origen 
- [ ] **typescript -** lenguaje para el desarrollo de JavaScript a escala de aplicación
- [ ] **webpack -** paquetes de módulos CommonJs/AMD para el navegador. Permite dividir su base de código en múltiples paquetes, que se pueden cargar a pedido. 
- [ ] **webpack-cli -** conjunto flexible de comandos para que los desarrolladores aumenten la velocidad al configurar un proyecto de paquete web personalizado
- [ ] **webpack-node-externals -** permite definir elementos externos: módulos que no se deben agrupar. 
- [ ] **webpack-shell-plugin -** ejecutar comandos de shell antes y después de compilaciones de paquetes web 

## Scripts

- [ ] **"build": "npx tsc" -** transpila todo el codigo TypeScript a JavaScript en una carpeta
- [ ] **"start": "node dist/index.js" -** inicia la aplicacion node
- [ ] **"dev": "concurrently \" npx tsc --watch\" \"npx nodemon -q dist/index.js\"" -** transpila el codigo TS a JS en tiempo real e inicia la aplicacion con reinicio automatico cuando haya cualquier cambio
- [ ] **"test": "jest" -** ejecutar prueba mediante Jest
- [ ] **"serve:coverage": "npm run test && cd coverage/lcov-report && npx serve" -** ejecuta todas las pruebas, navega hasta la carpeta señalada y ejecuta serve para ver el listado en el navegador web

## Variables de entorno .env

- [ ] **PORT -** puerto de la aplicacion
