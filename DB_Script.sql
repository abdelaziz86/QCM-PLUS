-- Script de peuplement de la base de données QAN
-- Création des utilisateurs, questionnaires et questions

-- 1. Désactiver temporairement les contraintes de clés étrangères
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Vider les tables existantes dans le bon ordre (enfant d'abord, parent ensuite)
DELETE FROM `reponses`;
DELETE FROM `historique`;
DELETE FROM `questions`;
DELETE FROM `questionnaires`;
DELETE FROM `users`;

-- 3. Réinitialiser les auto-increments
ALTER TABLE `users` AUTO_INCREMENT = 1;
ALTER TABLE `questionnaires` AUTO_INCREMENT = 1;
ALTER TABLE `questions` AUTO_INCREMENT = 1;
ALTER TABLE `historique` AUTO_INCREMENT = 1;
ALTER TABLE `reponses` AUTO_INCREMENT = 1;

-- 4. Réactiver les contraintes
SET FOREIGN_KEY_CHECKS = 1;

-- 5. Insertion des utilisateurs avec mots de passe cryptés
INSERT INTO `users` (`nom`, `prenom`, `societe`, `email`, `password`, `role`, `profile_picture`, `created_at`) VALUES
('Stagiaire', 'Test', 'Entreprise XYZ', 'stagiaire@test.com', '$2b$10$rFp9tJo2ii8OkFaW6eV2teI2GZQlheWKlaxeZ7i5HNqw5jv4kRMXO', 'stagiaire', NULL, NOW()),
('Admin', 'Système', 'Entreprise XYZ', 'admin@test.com', '$2b$10$rFp9tJo2ii8OkFaW6eV2teI2GZQlheWKlaxeZ7i5HNqw5jv4kRMXO', 'admin', NULL, NOW()),
('Super', 'Admin', 'Entreprise XYZ', 'superadmin@test.com', '$2b$10$rFp9tJo2ii8OkFaW6eV2teI2GZQlheWKlaxeZ7i5HNqw5jv4kRMXO', 'superadmin', NULL, NOW());

-- 6. Insertion des questionnaires
INSERT INTO `questionnaires` (`nom`, `description`, `created_at`) VALUES
('JavaScript Basics', 'Questionnaire sur les bases du JavaScript : variables, fonctions, DOM', NOW()),
('Python Fundamentals', 'Concepts fondamentaux de Python : syntaxe, structures de données', NOW()),
('Java OOP', 'Programmation Orientée Objet en Java : classes, héritage, polymorphisme', NOW()),
('HTML/CSS', 'Structure web et mise en forme : balises HTML et propriétés CSS', NOW()),
('React.js', 'Framework JavaScript moderne : composants, état, hooks', NOW()),
('Node.js Backend', 'Développement backend avec Node.js : modules, Express, API', NOW()),
('SQL Database', 'Bases de données relationnelles : requêtes, jointures, optimisation', NOW()),
('Git Version Control', 'Gestion de versions : commits, branches, merge', NOW()),
('Docker Containers', 'Conteneurisation : images, Dockerfile, orchestration', NOW()),
('API REST', 'Conception d''APIs RESTful : endpoints, méthodes HTTP, authentification', NOW());

-- 7. Insertion des questions pour chaque questionnaire

-- Questionnaire 1: JavaScript Basics
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(1, 'Quelle est la différence entre "let" et "var" en JavaScript ?', 'let a une portée de bloc, var a une portée de fonction', 'let est plus rapide que var', 'var est une version obsolète de let', 'Aucune différence', 'let ne peut pas être réaffecté', '1,0,0,0,0', NOW()),
(1, 'Qu''est-ce qu''une closure en JavaScript ?', 'Une fonction qui a accès aux variables de sa portée externe', 'Une méthode pour fermer une application', 'Un type de variable globale', 'Une fonction anonyme', 'Un design pattern', '1,0,0,0,0', NOW()),
(1, 'Quelle méthode utilise-t-on pour convertir une chaîne en nombre entier ?', 'parseInt()', 'Number()', 'toInteger()', 'convertToInt()', 'stringToNumber()', '1,0,0,0,0', NOW()),
(1, 'Quel est le résultat de "2" + 2 en JavaScript ?', '"22"', '4', 'Erreur', 'NaN', '"4"', '1,0,0,0,0', NOW());

-- Questionnaire 2: Python Fundamentals
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(2, 'Comment crée-t-on une liste en Python ?', 'ma_liste = [1, 2, 3]', 'ma_liste = (1, 2, 3)', 'ma_liste = {1, 2, 3}', 'ma_liste = <1, 2, 3>', 'ma_liste = 1, 2, 3', '1,0,0,0,0', NOW()),
(2, 'Quelle est la différence entre une liste et un tuple ?', 'Les listes sont mutables, les tuples sont immuables', 'Les tuples sont plus rapides', 'Les listes peuvent contenir des types différents', 'Aucune différence', 'Les tuples sont ordonnés', '1,0,0,0,0', NOW()),
(2, 'Comment itère-t-on sur un dictionnaire ?', 'for cle, valeur in dictionnaire.items():', 'for element in dictionnaire:', 'for i in range(len(dictionnaire)):', 'dictionnaire.forEach()', 'for cle in dictionnaire.keys():', '1,0,0,0,0', NOW());

-- Questionnaire 3: Java OOP
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(3, 'Qu''est-ce qu''une classe abstraite en Java ?', 'Une classe qui ne peut pas être instanciée', 'Une classe sans méthodes', 'Une classe finale', 'Une classe avec seulement des méthodes statiques', 'Une classe interface', '1,0,0,0,0', NOW()),
(3, 'Quelle est la différence entre interface et classe abstraite ?', 'Une interface ne peut avoir que des méthodes abstraites', 'Une classe abstraite peut avoir des implémentations', 'Une interface supporte l''héritage multiple', 'Toutes ces réponses', 'Aucune différence', '0,0,0,1,0', NOW()),
(3, 'Qu''est-ce que le polymorphisme ?', 'Capacité d''un objet à prendre plusieurs formes', 'Héritage de plusieurs classes', 'Surcharge des opérateurs', 'Encapsulation des données', 'Abstraction des méthodes', '1,0,0,0,0', NOW()),
(3, 'Comment déclare-t-on une constante en Java ?', 'final int MA_CONSTANTE = 10;', 'const int MA_CONSTANTE = 10;', 'static int MA_CONSTANTE = 10;', 'constant int MA_CONSTANTE = 10;', 'readonly int MA_CONSTANTE = 10;', '1,0,0,0,0', NOW());

-- Questionnaire 4: HTML/CSS
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(4, 'Quelle balise HTML utilise-t-on pour créer un lien ?', '<a>', '<link>', '<href>', '<url>', '<navigation>', '1,0,0,0,0', NOW()),
(4, 'Comment centre-t-on un élément horizontalement en CSS ?', 'margin: 0 auto;', 'text-align: center;', 'align: center;', 'center: true;', 'position: center;', '1,0,0,0,0', NOW()),
(4, 'Quelle propriété CSS utilise-t-on pour l''espacement interne ?', 'padding', 'margin', 'spacing', 'gap', 'inner-space', '1,0,0,0,0', NOW()),
(4, 'Qu''est-ce que le modèle de boîte CSS ?', 'margin + border + padding + content', 'width + height', 'block + inline', 'div + span', 'box-sizing', '1,0,0,0,0', NOW());

-- Questionnaire 5: React.js
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(5, 'Qu''est-ce qu''un hook en React ?', 'Une fonction qui permet d''utiliser state et lifecycle', 'Un composant fonctionnel', 'Une méthode de classe', 'Un design pattern', 'Un type de prop', '1,0,0,0,0', NOW()),
(5, 'Quel hook utilise-t-on pour les effets secondaires ?', 'useEffect', 'useState', 'useContext', 'useReducer', 'useSideEffect', '1,0,0,0,0', NOW()),
(5, 'Comment passe-t-on des données à un composant enfant ?', 'Via les props', 'Via le state', 'Via le context', 'Via les refs', 'Via les hooks', '1,0,0,0,0', NOW());

-- Questionnaire 6: Node.js Backend
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(6, 'Qu''est-ce que le gestionnaire de packages de Node.js ?', 'npm', 'npx', 'yarn', 'pnpm', 'Node Package Manager', '1,0,0,0,1', NOW()),
(6, 'Comment gère-t-on les opérations asynchrones en Node.js ?', 'Callbacks, Promises, async/await', 'Threads seulement', 'Processus enfants', 'Web Workers', 'Synchronisation', '1,0,0,0,0', NOW()),
(6, 'Quel module natif utilise-t-on pour les systèmes de fichiers ?', 'fs', 'path', 'os', 'http', 'file', '1,0,0,0,0', NOW());

-- Questionnaire 7: SQL Database
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(7, 'Quelle clause utilise-t-on pour filtrer les résultats ?', 'WHERE', 'HAVING', 'FILTER', 'CONDITION', 'IF', '1,0,0,0,0', NOW()),
(7, 'Quelle jointure retourne tous les records des deux tables ?', 'FULL OUTER JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', '1,0,0,0,0', NOW()),
(7, 'Comment optimise-t-on une requête lente ?', 'Ajout d''index', 'Réduction des jointures', 'Utilisation de sous-requêtes', 'Augmentation de la mémoire', 'Toutes ces réponses', '0,0,0,0,1', NOW());

-- Questionnaire 8: Git Version Control
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(8, 'Quelle commande utilise-t-on pour créer un nouveau dépôt ?', 'git init', 'git create', 'git new', 'git start', 'git clone', '1,0,0,0,0', NOW()),
(8, 'Comment annule-t-on un commit non pushé ?', 'git reset --soft HEAD~1', 'git undo', 'git revert', 'git delete', 'git remove', '1,0,0,0,0', NOW()),
(8, 'Quelle est la différence entre merge et rebase ?', 'merge préserve l''historique, rebase le réécrit', 'rebase est plus sûr', 'merge est plus rapide', 'Aucune différence', 'rebase crée des commits de merge', '1,0,0,0,0', NOW());

-- Questionnaire 9: Docker Containers
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(9, 'Qu''est-ce qu''un Dockerfile ?', 'Un script pour construire une image Docker', 'Un fichier de configuration', 'Un conteneur exécutable', 'Une image compressée', 'Un registre Docker', '1,0,0,0,0', NOW()),
(9, 'Quelle commande lance un conteneur ?', 'docker run', 'docker start', 'docker exec', 'docker create', 'docker launch', '1,0,0,0,0', NOW()),
(9, 'Qu''est-ce que Docker Compose ?', 'Outil pour gérer multi-conteneurs', 'Alternative à Docker', 'Version cloud de Docker', 'Interface graphique', 'Service de registry', '1,0,0,0,0', NOW());

-- Questionnaire 10: API REST
INSERT INTO `questions` (`questionnaire_id`, `description`, `reponse_1`, `reponse_2`, `reponse_3`, `reponse_4`, `reponse_5`, `bonne_reponse`, `created_at`) VALUES
(10, 'Quel code HTTP pour une création réussie ?', '201 Created', '200 OK', '204 No Content', '301 Moved', '400 Bad Request', '1,0,0,0,0', NOW()),
(10, 'Quelle méthode HTTP pour mettre à jour une ressource ?', 'PUT ou PATCH', 'POST', 'GET', 'DELETE', 'UPDATE', '1,0,0,0,0', NOW()),
(10, 'Qu''est-ce que HATEOAS ?', 'Hypermedia comme moteur de l''état de l''application', 'Protocole d''authentification', 'Format de réponse', 'Méthode de compression', 'Type d''encodage', '1,0,0,0,0', NOW()),
(10, 'Comment sécurise-t-on une API REST ?', 'JWT Tokens', 'API Keys', 'OAuth', 'Toutes ces réponses', 'HTTPS seulement', '0,0,0,1,0', NOW());

-- Message de confirmation
SELECT '✅ Données insérées avec succès!' as Status;