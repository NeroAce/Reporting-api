export function listQueryHandler(query, field) {
  const obj = {};
  if (Array.isArray(query)) {
    const x = [];
    for (var i of query) {
      x.push(i);
    }

    obj[field] = { in: x };
    return obj;
  } else {
    obj[field] = query;
    return obj;
  }
}

export function listQueryHandlerNested(query, field, nestedField) {
  const obj = {};
  const obj2 = {};
  if (Array.isArray(query)) {
    const x = [];
    for (var i of query) {
      x.push(i);
    }
    obj2[nestedField] = { in: x };
    obj[field] = obj2;
    return obj;
  } else {
    obj2[nestedField] = query;
    obj[field] = obj2;
    return obj;
  }
}
