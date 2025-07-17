-- Inserir dados de exemplo para teste
INSERT INTO public."User" (
  "userName", 
  "email", 
  "password", 
  "cityUser", 
  "stateUser",
  "rolePermission",
  "roleValue"
) VALUES (
  'Usuário Teste',
  'teste@exemplo.com',
  'senha123',
  'São Paulo',
  'SP',
  'Admin',
  1
) ON CONFLICT ("email") DO NOTHING;

INSERT INTO public."Team" (
  "nameTeam",
  "accessCode"
) VALUES (
  'Equipe Principal',
  'TEAM001'
) ON CONFLICT ("accessCode") DO NOTHING;