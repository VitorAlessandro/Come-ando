import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  
  const postgresVersion = await database.query("SHOW server_version;")
  const postgresVersionResult = postgresVersion.rows[0].server_version
  
  const dbConnections = await database.query("SHOW max_connections;")
  const dbConnectionsResult = dbConnections.rows[0].max_connections

  const databaseName = process.env.POSTGRES_DB;
  const dbOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const dbOpenedConnectionsValue = dbOpenedConnectionsResult.rows[0].count;
  
  response.status(200).json({  
    updated_at: updatedAt,
    dependencies: {
      database: {
        postgres_version: postgresVersionResult,
        max_connections: parseInt(dbConnectionsResult),
        opened_connections: dbOpenedConnectionsValue, 
      },
    },
  });
}


export default status;
