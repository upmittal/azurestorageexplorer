﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Azure;
using Azure.Data.Tables;

using StorageLibrary.Common;
using StorageLibrary.Interfaces;

namespace StorageLibrary
{
	internal class AzureTable : StorageObject, ITable
	{
		public AzureTable(string account, string key, string endpoint)
		: base(account, key, endpoint) { }

		public async Task<List<string>> ListTablesAsync()
		{
			TableServiceClient client = new TableServiceClient(ConnectionString);
			List<string> results = new List<string>();
			await foreach (var table in client.QueryAsync())
				results.Add(table.Name);

			return results;
		}

		public async Task Create(string tableName)
		{
			TableClient table = new TableClient(ConnectionString, tableName);

			await table.CreateAsync();
		}

		public async Task Delete(string tableName)
		{
			TableClient table = new TableClient(ConnectionString, tableName);
			await table.DeleteAsync();
		}

		public async Task InsertAsync(string tableName, string data)
		{
			TableClient table = new TableClient(ConnectionString, tableName);
			TableEntity entity = TableEntityWrapper.Get(data);
			await table.AddEntityAsync<TableEntity>(entity);
		}


		public async Task<IEnumerable<TableEntityWrapper>> QueryAsync(string tableName, string query)
		{
			TableClient table = new TableClient(ConnectionString, tableName);
			AsyncPageable<TableEntity> queryResultsFilter = table.QueryAsync<TableEntity>(query);

			List<TableEntityWrapper> results = new List<TableEntityWrapper>();

			await foreach (TableEntity entity in queryResultsFilter)
				results.Add(new TableEntityWrapper(entity));

			return results;
		}

		public async Task DeleteEntityAsync(string tableName, string partitionKey, string rowKey)
		{
			TableClient table = new TableClient(ConnectionString, tableName);
			await table.DeleteEntityAsync(partitionKey, rowKey);
		}
	}
}
