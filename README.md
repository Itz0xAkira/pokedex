# Pokedex - gotta catch em all

A full-stack Pokemon management application built with Next.js, GraphQL, and PostgreSQL. Search, filter, and manage Pokemon with the ability to create custom Pokemon entries.

note: everything here is commited @ 5:16 am like a great dev would do :) 
## 🎯 Features

- **Authentication System**: Secure JWT-based authentication for user registration and login
- **Pokemon Search & Browse**: Paginated Pokemon list with advanced search capabilities
- **Advanced Filtering**: Filter by name, height, weight, types, weaknesses, and abilities
- **Sorting**: Sort Pokemon by name, Pokedex ID, height, or weight
- **Custom Pokemon**: Create, edit, and delete your own custom Pokemon (requires authentication)
- **Pokemon Details**: Detailed view of each Pokemon with stats, types, weaknesses, and more
- **GraphQL API**: Modern GraphQL API powered by Apollo Server
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Next.js API Routes with GraphQL
- **Database**: PostgreSQL with Prisma ORM
- **GraphQL**: Apollo Server & Apollo Client
- **Authentication**: JWT (jsonwebtoken) with bcryptjs
- **Styling**: Tailwind CSS
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 20+ (or use Docker)
- PostgreSQL 15+ (or use Docker Compose)
- npm or yarn

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokedex
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://pokemon:pokemon123@localhost:5433/pokemon_db?schema=public"
   JWT_SECRET="your-secret-key-here"
   NODE_ENV="development"
   ```

3. **Start the application with Docker Compose**
   ```bash
   docker-compose up
   ```

   This will:
   - Start PostgreSQL database
   - Build and start the Next.js application
   - Run database migrations
   - Seed the database (if configured)

   The application will be available at `http://localhost:3000`

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poke-new-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pokemon_db?schema=public"
   JWT_SECRET="your-secret-key-here"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # (Optional) Seed the database
   npm run prisma:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
poke-new-v2/
├── app/                    # Next.js app directory
│   ├── api/graphql/       # GraphQL API route
│   ├── login/             # Login page
│   ├── pokemon/           # Pokemon pages (list, detail, edit, new)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── pokemon/           # Pokemon-related components
│   ├── search/            # Search and filter components
│   └── shared/            # Shared components
├── graphql/               # GraphQL schema and resolvers
│   ├── schema.ts          # GraphQL type definitions
│   ├── resolvers.ts       # GraphQL resolvers
│   └── context.ts         # GraphQL context
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── apollo-client.ts   # Apollo Client setup
│   ├── auth.ts            # Authentication utilities
│   ├── graphql/           # GraphQL queries
│   └── prisma.ts          # Prisma client
├── prisma/                # Prisma configuration
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Database seed script
├── public/                # Static assets
├── scripts/               # Utility scripts
└── types/                 # TypeScript type definitions
```

## 🔐 Authentication

The application uses JWT-based authentication. To access protected features:

1. **Register a new account** via the GraphQL mutation:
   ```graphql
   mutation Register {
     register(input: { email: "user@example.com", password: "password123" }) {
       token
       user {
         id
         email
       }
     }
   }
   ```

2. **Login** via the GraphQL mutation:
   ```graphql
   mutation Login {
     login(input: { email: "user@example.com", password: "password123" }) {
       token
       user {
         id
         email
       }
     }
   }
   ```

3. Include the JWT token in subsequent requests (handled automatically by Apollo Client)

## 📡 GraphQL API

The application exposes a GraphQL API at `/api/graphql`. Key operations:

### Queries

- `pokemons(page, pageSize, sort, filter)`: Get paginated Pokemon list
- `pokemon(id, pokedexId, name)`: Get a single Pokemon by ID, Pokedex ID, or name
- `me`: Get current authenticated user

### Mutations

- `register(input)`: Register a new user
- `login(input)`: Login and get JWT token
- `createPokemon(input)`: Create a new custom Pokemon (requires auth)
- `updatePokemon(input)`: Update an existing Pokemon (requires auth)
- `deletePokemon(id)`: Delete a Pokemon (requires auth)

### Example Query

```graphql
query GetPokemons {
  pokemons(
    page: 1
    pageSize: 20
    sort: { field: NAME, direction: ASC }
    filter: { 
      types: ["Fire", "Water"]
      heightMin: 0.5
      heightMax: 2.0
    }
  ) {
    pokemons {
      id
      name
      pokedexId
      height
      weight
      image
      types
      abilities
    }
    pagination {
      page
      pageSize
      totalPages
      totalCount
    }
  }
}
```

## 🗄️ Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Hashed password
- `createdAt`, `updatedAt`: Timestamps

### Pokemon
- `id`: Unique identifier
- `name`: Pokemon name (unique)
- `pokedexId`: National Pokedex number (optional, unique)
- `height`, `weight`: Physical measurements
- `image`, `imageShiny`: Image URLs
- `types`: Array of Pokemon types
- `abilities`: Array of abilities
- `baseStats`: JSON object with HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed
- `description`: Flavor text
- `species`: Pokemon species name
- `isCustom`: Boolean flag for custom Pokemon
- `createdByUserId`: User who created the Pokemon (for authorization)
- `createdAt`, `updatedAt`: Timestamps

## 📜 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run prisma:generate`: Generate Prisma Client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio (database GUI)
- `npm run prisma:seed`: Seed the database with sample data

## 🐳 Docker Commands

- `docker-compose up`: Start all services
- `docker-compose up -d`: Start services in detached mode
- `docker-compose down`: Stop all services
- `docker-compose logs`: View logs
- `docker-compose logs -f app`: Follow app logs

## 🔍 Search & Filter Features

- **Name Search**: Filter Pokemon by name (partial match)
- **Height Range**: Filter by minimum and maximum height
- **Weight Range**: Filter by minimum and maximum weight
- **Types**: Filter by one or more Pokemon types
- **Weaknesses**: Filter by weakness types (calculated from Pokemon types)
- **Abilities**: Filter by ability name
- **Pokedex ID Range**: Filter by Pokedex ID range
- **Sorting**: Sort by name, Pokedex ID, height, or weight (ascending/descending)
- **Pagination**: Choose page size (10, 20, or 50 items per page)

## 🎨 UI Features

- Modern, responsive design
- Pokemon type badges with color coding
- Interactive stats charts
- Advanced search toggle
- Loading states and error handling
- Pokemon detail pages with navigation
- Image galleries (regular and shiny variants)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- Pokemon data sourced from [PokeAPI](https://pokeapi.co/)
- Built as a sample project for full-stack development

---

**Gotta catch 'em all!** 🎮
