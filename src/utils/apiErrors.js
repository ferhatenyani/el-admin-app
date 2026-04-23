const ERROR_MESSAGES = {
  // Generic / framework
  'error.validation': 'Données invalides. Veuillez vérifier les informations saisies.',
  'error.concurrencyFailure': 'Conflit de mise à jour. Veuillez actualiser et réessayer.',

  // ID / entity
  'error.idexists': 'Cet élément possède déjà un identifiant.',
  'error.idnull': 'Identifiant manquant.',
  'error.idinvalid': 'Identifiant invalide.',
  'error.idnotfound': 'Élément introuvable.',

  // User / auth
  'error.invalidauth': 'Authentification invalide.',
  'error.emailexists': 'Cette adresse email est déjà utilisée par un autre compte.',
  'error.imageuploadfailed': 'Échec du téléchargement de la photo de profil.',
  'error.keycloaksyncfailed': 'Erreur de synchronisation du compte. Veuillez réessayer.',
  'error.tokenexpired': 'Session expirée. Veuillez vous reconnecter.',
  'error.invalidcurrentpassword': 'Mot de passe actuel incorrect.',
  'error.passwordchangefailed': 'Échec du changement de mot de passe. Veuillez réessayer.',
  'error.cannotmodifyadmin': 'Impossible de modifier le statut du compte administrateur.',

  // Books
  'error.titlerequired': 'Le titre est requis.',
  'error.pricerequired': 'Le prix est requis.',
  'error.invalidprice': 'Le prix doit être un nombre positif.',
  'error.bookinactive': 'Ce livre est inactif et ne peut pas être modifié.',
  'error.taginactive': "Impossible d'assigner un tag inactif.",
  'error.bookpackinactive': "Impossible d'assigner un pack inactif.",

  // Book packs
  'error.titleexists': 'Un pack avec ce titre existe déjà.',
  'error.minbooks': 'Un pack doit contenir au moins 2 livres.',

  // Authors
  'error.namerequired': "Le nom de l'auteur est requis.",

  // Tags
  'error.nameenrequired': 'Le nom anglais est requis.',
  'error.namefrrequired': 'Le nom français est requis.',
  'error.typerequired': 'Le type est requis.',
  'error.typeimmutable': 'Le type du tag ne peut pas être modifié.',
  'error.imagenotallowed': 'Les images ne sont autorisées que pour les tags de catégorie.',
  'error.invalidtagtype': 'Type de tag invalide pour cette opération.',
  'error.emptytagids': 'La liste des tags est vide.',
  'error.tagsnotfound': 'Certains tags sont introuvables.',

  // Files / images
  'error.filerequired': 'Un fichier est requis.',
  'error.filesizeexceeded': 'La taille du fichier dépasse la limite de 5 Mo.',
  'error.invalidfiletype': 'Type de fichier invalide. Seuls JPEG, PNG et WebP sont acceptés.',
  'error.invalidextension': 'Extension de fichier invalide.',
  'error.invalidimage': 'Image invalide ou corrompue.',
  'error.imageconversionfailed': "Échec du traitement de l'image.",
  'error.invalidfilename': 'Nom de fichier invalide.',
  'error.filestoragefailed': 'Échec du stockage du fichier.',

  // Orders
  'error.exportfailed': "Échec de l'exportation. Veuillez réessayer.",
  'error.phonerequired': 'Un numéro de téléphone est requis pour cette commande.',
  'error.invaliditem': 'Article de commande invalide (bookId ou bookPackId manquant).',

  // Filters / validation ranges
  'error.min_price_greater_than_max_price': 'Le prix minimum ne peut pas être supérieur au prix maximum.',
  'error.min_amount_greater_than_max_amount': 'Le montant minimum ne peut pas être supérieur au montant maximum.',
  'error.date_from_after_date_to': 'La date de début ne peut pas être après la date de fin.',
};

/**
 * Extracts a human-readable French message from an axios API error.
 * Falls back to the response title/detail, then error.message, then the provided fallback.
 */
export function getApiErrorMessage(error, fallback = 'Une erreur est survenue') {
  const code = error?.response?.data?.message;
  if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
  return (
    error?.response?.data?.title ||
    error?.response?.data?.detail ||
    error?.message ||
    fallback
  );
}
