const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
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
        return Client.findById(parents.clientId);
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

// Mutations
const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // add a client
    addClient: {
      type: ClientType,
      description: 'Adding new client',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parents, args) => {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });

        return client.save();
      },
    },
    // delete a client
    deleteClient: {
      type: ClientType,
      description: 'Delete a client',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parents, args) => {
        Project.find({ clientId: args.id }).then((projects) =>
          projects.forEach((project) => {
            project.remove();
          })
        );
        return Client.findByIdAndRemove(args.id);
      },
    },
    // add a project
    addProject: {
      type: ProjectType,
      description: 'Add a project',
      args: {
        name: {
          type: GraphQLNonNull(GraphQLString),
        },
        description: {
          type: GraphQLNonNull(GraphQLString),
        },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatus',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (parents, args) => {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });

        return project.save();
      },
    },
    // delete a project
    deleteProject: {
      type: ProjectType,
      description: 'Delete a project',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parents, args) => {
        return Project.findByIdAndRemove(args.id);
      },
    },
    // update a project
    updateProject: {
      type: ProjectType,
      description: 'Update a project',
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate',
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve: (parents, args) => {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
