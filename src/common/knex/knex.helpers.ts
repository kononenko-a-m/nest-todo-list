const JOIN_FIELD_ALIAS_SEPARATOR = '___';

export function querySelectFieldInTable(
  tableName: string,
  fields: { [index: string]: string },
  joinAlias: null | string = null,
) {
  return Object.entries(fields).reduce((acc, [asName, originalFieldName]) => {
    acc[
      joinAlias ? `${joinAlias}${JOIN_FIELD_ALIAS_SEPARATOR}${asName}` : asName
    ] = `${tableName}.${originalFieldName}`;
    return acc;
  }, {});
}

export function groupJoins(record: { [index: string]: unknown }) {
  return Object.entries(record).reduce((acc, [columnName, value]) => {
    if (columnName.includes(JOIN_FIELD_ALIAS_SEPARATOR)) {
      const [joinAlias, joinColumnName] = columnName.split(
        JOIN_FIELD_ALIAS_SEPARATOR,
      );

      if (joinAlias in acc) {
        acc[joinAlias] = {};
      }

      acc[joinAlias][joinColumnName] = value;
    } else {
      acc[columnName] = value;
    }

    return acc;
  }, {});
}
