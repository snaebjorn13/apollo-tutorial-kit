import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { Engine } from 'apollo-engine';

import schema from './data/schema';

const GRAPHQL_PORT = 3000;
const ENGINE_API_KEY = 'service:snaebjorn13-6283:BAIkFtcLw9ESeV0K5_u9-w';

const engine = new Engine({
	engineConfig: {
		apiKey: ENGINE_API_KEY,
		stores: [
			{
				name: 'inMemEmbeddedCache',
				inMemory: {
					cacheSize: 20971520
				}
			}
		],
		queryCache: {
			publicFullQueryStore: 'inMemEmbeddedCache'
		}
	},
	graphqlPort: GRAPHQL_PORT,
});

engine.start();

const graphQLServer = express();

graphQLServer.use(engine.expressMiddleware());

graphQLServer.use('/graphql', compression());

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
	schema,
	tracing: true,
	cacheControl: true
}));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () =>
	console.log(
		`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
	)
);
