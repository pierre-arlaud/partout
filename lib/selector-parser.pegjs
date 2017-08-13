items
 = item*

item
 = ws access:access { access.connector = 'descendant'; return access; }
 / '.' access:access { access.connector = 'child'; return access; }
 / slash:[/^]? secondSlash: '/'? access: access { access.connector = slash !== null && secondSlash === null ? 'child' : 'descendant'; return access; }

access
= id:id rules:rules? type:(':' type)? {
      var access = { path: id };
      if (rules) access.rules = rules;
      if (type && type[1]) access.type = type[1];
      return access;
    }
 / '*' { return { path: '*'}; }

rules
 = '[' $rulescontent ']'
 / '{' $rulescontent '}'

rulescontent
 = ws* id:id ws* { return [{ 'path': id }]; }

id "identifier"
 = $([$_a-zA-Z][$_a-zA-Z0-9-]*)

type
 = 'object'
 / 'string'
 / 'number'
 / 'date'
 / 'boolean'

ws "whitespace"
 = [ \t\n\r]+
 
