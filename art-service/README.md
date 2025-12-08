# Art Service

Service de gestion des commentaires pour les oeuvres d'art.

## Description

Service permettant de gérer les commentaires associés aux oeuvres d'art. Il permet de créer, lire et supprimer des commentaires.

## Documentation API

```yaml
info:
  title: Art Service API
  description:
    API REST pour la gestion des commentaires sur les oeuvres d'art.
    Toutes les routes nécessitent une authentification JWT valide (sauf /health et /).

servers:
  - url: http://localhost:4001
    description: Serveur loclal

tags:
  - name: health
    description: Endpoint pour la vérification
  - name: Comments
    description: Gestion des commentaires

paths:
  # /:
  #   get:
  #     summary: Message de bienvenue
  #     description: Retourne un message de bienvenue simple
  #     tags:
  #       - Health
  #     responses:
  #       '200':
  #         description: Message de bienvenue
  #         content:
  #           text/plain:
  #             schema:
  #               type: string
  #               example: "Hello World!"

  /health:
    get:
      summary: Vérification de santé
      description: Endpoint pour vérifier l'état du service
      tags:
        - Health
      responses:
        '200':
          description: Service opérationnel
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthResponse'

  /comments:
    post:
      summary: Créer un commentaire
      description: Crée un nouveau commentaire
      tags:
        - Comments
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCommentDto'
            example:
              content: "Un super commentaire constructif"
              artwork: 1
              parentId: null
      responses:
        '201':
          description: Commentaire créé avec succès
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '400':
          description: Données invalides
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Non authentifié
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    get:
      summary: Lister les commentaires de l'utilisateur
      description: Récupère tous les commentaires de l'utilisateur authentifié
      tags:
        - Comments
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Liste des commentaires
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Comment'
        '401':
          description: Non authentifié
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /comments/artwork/{id}:
    get:
      summary: Lister les commentaires d'une oeuvre
      description: Récupère tous les commentaires associés à une oeuvre spécifique
      tags:
        - Comments
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID de l'oeuvre d'art
          schema:
            type: integer
            example: 1
      responses:
        '200':
          description: Liste des commentaires de l'oeuvre
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Comment'
        '400':
          description: ID invalide
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Non authentifié
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /comments/{id}:
    get:
      summary: Obtenir un commentaire
      description: Récupère un commentaire spécifique de l'utilisateur authentifié
      tags:
        - Comments
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID du commentaire
          schema:
            type: integer
            example: 1
      responses:
        '200':
          description: Commentaire trouvé
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
        '404':
          description: Commentaire non trouvé
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Non authentifié
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    delete:
      summary: Supprimer un commentaire
      description: Supprime un commentaire de l'utilisateur authentifié
      tags:
        - Comments
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          description: ID du commentaire à supprimer
          schema:
            type: integer
            example: 1
      responses:
        '200':
          description: Commentaire supprimé avec succès
          content:
            application/json:
              schema:
                type: object
                properties:
                  count:
                    type: integer
                    description: Nombre de commentaires supprimés
                    example: 1
        '404':
          description: Commentaire non trouvé
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
        '401':
          description: Non authentifié
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT token obtenu via l'endpoint d'authentification.
        Format: Bearer {token}

  schemas:
    HealthResponse:
      type: object
      properties:
        status:
          type: string
          example: "ok"
        service:
          type: string
          example: "art-service"
        timestamp:
          type: string
          format: date-time
          example: "2024-01-15T10:30:00.000Z"
      required:
        - status
        - service
        - timestamp

    CreateCommentDto:
      type: object
      required:
        - content
        - artwork
      properties:
        content:
          type: string
          description: Contenu du commentaire
          minLength: 1
          example: "Encore un commentaire constructif"
        artwork:
          type: integer
          description: ID de l'oeuvre
          example: 1
        parentId:
          type: integer
          nullable: true
          description: Id du commentaire parent (pour les réponses)
          example: null
      example:
        content: "Un avis que personne n'a demandé"
        artwork: 1
        parentId: null

    Comment:
      type: object
      properties:
        id:
          type: integer
          description: Identifiant unique du commentaire
          example: 1
        user:
          type: string
          description: Identifiant de l'utilisateur ayant créé le commentaire
          example: "user-123"
        artwork:
          type: integer
          description: Id de l'oeuvre associée
          example: 1
        content:
          type: string
          description: Contenu du commentaire
          example: "C'est super"
        parentId:
          type: integer
          nullable: true
          description: Id du commentaire parent (null pour les commentaire à l'origine)
          example: null
        createdAt:
          type: string
          format: date-time
          description: Date de création du commentaire
          example: "2024-01-15T10:30:00.000Z"
      required:
        - id
        - user
        - artwork
        - content
        - createdAt

    Error:
      type: object
      properties:
        statusCode:
          type: integer
          example: 400
        message:
          type: string
          example: "Bad Request"
        error:
          type: string
          example: "Validation failed"
      required:
        - statusCode
        - message
```

## Authentification

Tous les endpoints (sauf `/` et `/health`) nécessitent d'être authentifié. 

Pour utiliser l'api, il faut mettre le token JWT dans le header `Authorization` :

```
Authorization: Bearer <token>
```

Le token JWT doit contenir un champ **sub** avec l'identifiant de l'utilisateur.

## Installation

```bash
npm install
```

## Configuration

Le service nécessite les variables d'environnement suivantes :

- `PORT` : Port d'écoute du service (défaut: 4001)
- `DATABASE_URL` : Url de connexion à la base de données sqlite
- `JWT_SECRET` : Secret pour la validation des tokens JWT

## Lancement

```bash
npm run start:dev
```

## Base de données

Le service utilise Prisma avec sqlite. Pour initialiser la base de données :

```bash
npx prisma generate
npx prisma migrate dev
```

## Déploiement avec Docker

### Construction de l'image

```bash
# front pour les modifications
docker build -t tartines/frontend:latest frontend
docker push tartines/frontend:latest

# service
docker build -t tartines/art-service:latest art-service
docker push tartines/art-service:latest
```

### Lancement du projet

```bash
docker compose up -d
```

### Vérifications

```bash
docker ps
docker logs art-service
curl http://localhost:4001/health
```

## Déploiement avec Minikube


### Démarrer Minikube

```bash
minikube start
minikube status
```

### Construire l'image dans Minikube

```bash
eval $(minikube docker-env)
```

### Déployer le service

```bash
kubectl apply -f k8s/art/deployment.yaml
kubectl apply -f k8s/art/service.yaml

# Déployer l'ingress
kubectl apply -f k8s/ingress/ingress.yaml
```
### Initialiser prisma au premier deploiement
```kubectl get pods
kubectl exec -it art-service-xxx -- sh
npx prisma db push
exit
kubectl delete pod art-service-xxx ```


### Activer l'ingress dans Minikube

```bash
minikube addons enable ingress
kubectl get ingress
```

### Vérifier le déploiement

```bash
kubectl get pods
kubectl get svc
```

### Accéder au service

Le service est accessible via l'ingress à l'adresse suivante :

```bash
# avec l'ingress (marche pas ??)
curl http://devops.local/art/health
curl http://devops.local/art/comments

# sinon
kubectl port-forward svc/art-service 4001:4001
curl http://localhost:4001/health
```

**Note** : Tous les endpoints du service commencent par `/art` via l'ingress :
- `http://devops.local/art/health`
- `http://devops.local/art/comments`
- `http://devops.local/art/comments/artwork/1`

### Mise à jour du déploiement

```bash
kubectl rollout restart deployment art-service
```

### Supprimer le déploiement

```bash
kubectl delete -f k8s/art/service.yaml
kubectl delete -f k8s/art/deployment.yaml
```
