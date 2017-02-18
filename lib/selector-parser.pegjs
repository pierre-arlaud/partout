items
 = item*

item
 = ws access:access { access.connector = 'ws'; return access; }
 / '.' access:access { access.connector = 'dot'; return access; }
 / access:access { access.connector = 'start'; return access; }

access
 = id:id '[' rule:id ']' { return { path: id, rule: rule}; }
 / id:id { return { path: id }; }
 / '*' { return { path: '*'}; }
id "identifier"
 = $([$_a-zA-Z][$_a-zA-Z0-9-]*)

ws "whitespace"
 = [ \t\n\r]+
 
