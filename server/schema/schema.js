const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');

// mongoose models
const Project = require('../models/Project.js');
const Client = require('../models/Client.js');

// client type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// project type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve: (parents, args) => {
        return Client.findById(parents.id);
      },
    },
  }),
});

// root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    client: {
      type: ClientType,
      description: 'Description of a client',
      args: { id: { type: GraphQLID } },
      resolve: (parents, args) => {
        return Client.findById(args.id);
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      description: 'List of all clients',
      resolve: () => Client.find(),
    },
    project: {
      type: ProjectType,
      description: 'Description of a project',
      args: { id: { type: GraphQLID } },
      resolve: (parents, args) => {
        return Project.findById(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      description: 'List of all projects',
      resolve: () => {
        return Project.find();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
