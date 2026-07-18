export interface NewsItem {
  id: number;
  date: string;
  bg: string;
  title: string;
  title_ar: string;
  excerpt: string;
  excerpt_ar: string;
  body: string;
  body_ar: string;
}

export const NEWS: NewsItem[] = [
  {
    id: 1,
    date: "2026-06-01",
    bg: "linear-gradient(135deg, oklch(0.62 0.14 155), oklch(0.78 0.14 100))",
    title: "Ouverture de la campagne Estivage 2026",
    title_ar: "افتتاح حملة الاصطياف 2026",
    excerpt:
      "La campagne annuelle d'estivage est ouverte. Déposez votre demande en ligne avant la date limite pour bénéficier d'un séjour en centre partenaire.",
    excerpt_ar:
      "افتُتحت الحملة السنوية للاصطياف. يمكنكم إيداع طلباتكم عبر البوابة قبل تاريخ الإقفال للاستفادة من إقامة بأحد المراكز الشريكة.",
    body:
      "L'Association des Œuvres Sociales du personnel actif de la CMR a le plaisir d'annoncer l'ouverture de la campagne d'estivage pour l'année 2026. Les adhérents peuvent désormais soumettre leur demande depuis leur espace personnel, en indiquant leur destination privilégiée parmi les centres partenaires (Agadir, Tanger, Ifrane, Saïdia).\n\nLa demande doit être déposée avant la date limite affichée sur la page dédiée. Les affectations tiennent compte de l'ordre de dépôt, de la situation familiale et du nombre de bénéficiaires déjà servis les années précédentes, dans un souci d'équité.\n\nUne fois l'affectation confirmée par le gestionnaire, un reçu de pré-réservation est généré automatiquement et déposé dans votre bibliothèque documentaire.",
    body_ar:
      "يسرّ جمعية الأعمال الاجتماعية للموظفين العاملين بالصندوق المغربي للتقاعد الإعلان عن افتتاح حملة الاصطياف لسنة 2026. يمكن للمنخرطين إيداع طلباتهم مباشرة عبر فضائهم الشخصي، مع تحديد الوجهة المفضّلة من بين المراكز الشريكة (أكادير، طنجة، إفران، السعيدية).\n\nيجب إيداع الطلب قبل التاريخ الأقصى المُعلَن على الصفحة المخصصة. تراعي عمليات التوزيع ترتيب الإيداع والوضعية العائلية وعدد المستفيدين خلال السنوات السابقة، حرصاً على مبدأ الإنصاف.\n\nبمجرد تأكيد التوزيع من طرف المدبّر، يُولَّد وصل الحجز المبدئي تلقائياً ويُودَع في مكتبتكم الوثائقية.",
  },
  {
    id: 2,
    date: "2026-05-12",
    bg: "linear-gradient(135deg, oklch(0.72 0.16 55), oklch(0.65 0.14 25))",
    title: "Nouvelle convention avec Inwi : forfaits préférentiels",
    title_ar: "اتفاقية جديدة مع Inwi: عروض تفضيلية",
    excerpt:
      "Une convention élargie a été signée avec l'opérateur Inwi : forfaits mobiles et internet à des tarifs négociés pour tous les adhérents.",
    excerpt_ar:
      "تم توقيع اتفاقية موسّعة مع مشغّل Inwi تشمل عروضاً هاتفية وإنترنت بأسعار تفضيلية لفائدة جميع المنخرطين.",
    body:
      "Après plusieurs semaines de négociation, une nouvelle convention a été signée avec l'opérateur Inwi. Elle offre aux adhérents une gamme élargie de forfaits mobiles et internet à des tarifs préférentiels, avec possibilité d'ouvrir une nouvelle ligne ou de conserver son numéro existant par portabilité.\n\nLe portail permet désormais de passer commande en ligne, sans aucune pièce à téléverser. Une fois la commande enregistrée, un gestionnaire prépare la carte SIM correspondante et vous contacte pour la remise physique.",
    body_ar:
      "بعد أسابيع من التفاوض، تم توقيع اتفاقية جديدة مع مشغّل Inwi. توفّر هذه الاتفاقية للمنخرطين مجموعة موسّعة من العروض الهاتفية والإنترنت بأسعار تفضيلية، مع إمكانية فتح خط جديد أو الاحتفاظ بالرقم الحالي عبر خدمة النقل.\n\nتتيح البوابة الآن تقديم الطلب مباشرة عبر الأنترنت، دون الحاجة لأي وثيقة. بمجرد تسجيل الطلب، يُهيّئ المدبّر بطاقة SIM ويتصل بكم لتسلّمها يدوياً.",
  },
  {
    id: 3,
    date: "2026-04-03",
    bg: "linear-gradient(135deg, oklch(0.7 0.13 260), oklch(0.72 0.12 300))",
    title: "Subvention de scolarité : dépôt des demandes 2026-2027",
    title_ar: "منحة الدراسة: إيداع طلبات 2026-2027",
    excerpt:
      "Les demandes de subvention de scolarité pour la rentrée 2026-2027 sont ouvertes. Certificat de scolarité obligatoire.",
    excerpt_ar:
      "فُتح باب إيداع طلبات منحة الدراسة برسم الدخول المدرسي 2026-2027. شهادة مدرسية إلزامية.",
    body:
      "Comme chaque année, l'AOS-CMR accompagne ses adhérents dans les frais de scolarité de leurs enfants. Les demandes pour la rentrée 2026-2027 sont dès à présent ouvertes depuis votre espace personnel.\n\nSont éligibles les enfants âgés de 5,5 ans à 26 ans au 1er septembre 2026, sur présentation d'un certificat de scolarité en cours de validité. Le montant de la subvention varie en fonction du niveau (préscolaire, primaire, secondaire, supérieur).",
    body_ar:
      "كما جرت العادة، تواكب الجمعية منخرطيها في نفقات دراسة أبنائهم. طلبات الدخول المدرسي 2026-2027 مفتوحة من الآن عبر الفضاء الشخصي.\n\nيستفيد الأبناء الذين تتراوح أعمارهم بين 5,5 و26 سنة إلى غاية فاتح شتنبر 2026، بشرط الإدلاء بشهادة مدرسية سارية المفعول. يختلف مبلغ المنحة حسب المستوى الدراسي.",
  },
  {
    id: 4,
    date: "2026-02-18",
    bg: "linear-gradient(135deg, oklch(0.65 0.14 200), oklch(0.75 0.1 220))",
    title: "Journée de solidarité : bilan de l'action hivernale",
    title_ar: "يوم التضامن: حصيلة العملية الشتوية",
    excerpt:
      "Retour sur l'opération solidarité menée en hiver auprès des familles dans le besoin, avec le concours de nos partenaires associatifs.",
    excerpt_ar:
      "قراءة في عملية التضامن الشتوية لفائدة الأسر المعوزة، بشراكة مع الجمعيات المتعاونة.",
    body:
      "L'AOS-CMR a organisé cet hiver une opération de solidarité au profit de familles vivant dans les régions montagneuses touchées par la vague de froid. Grâce à la contribution des adhérents et à l'appui de partenaires associatifs, plus de 300 kits ont été distribués (couvertures, denrées, fournitures scolaires).\n\nL'association remercie chaleureusement l'ensemble des contributeurs et bénévoles qui ont rendu cette action possible.",
    body_ar:
      "نظّمت الجمعية هذا الشتاء عملية تضامنية لفائدة العائلات القاطنة بالمناطق الجبلية المتضررة من موجة البرد. بفضل مساهمة المنخرطين ودعم شركاء جمعويين، تم توزيع أزيد من 300 عُدّة (أغطية، مواد غذائية، لوازم مدرسية).\n\nتتوجه الجمعية بخالص الشكر إلى جميع المساهمين والمتطوعين الذين أسهموا في إنجاح هذه العملية.",
  },
  {
    id: 5,
    date: "2026-01-10",
    bg: "linear-gradient(135deg, oklch(0.7 0.12 340), oklch(0.75 0.1 20))",
    title: "Portail AOS-CMR : nouvelles fonctionnalités en ligne",
    title_ar: "بوابة AOS-CMR: خدمات جديدة على الخط",
    excerpt:
      "Le portail s'enrichit d'une bibliothèque documentaire personnelle et d'un suivi en temps réel de l'instruction de vos dossiers.",
    excerpt_ar:
      "تتعزّز البوابة بمكتبة وثائقية شخصية وتتبع مباشر لمعالجة ملفاتكم.",
    body:
      "De nouvelles fonctionnalités sont désormais disponibles sur votre espace personnel : une bibliothèque documentaire qui centralise l'ensemble des reçus, autorisations, attestations et notifications générés par l'association, ainsi qu'un suivi transparent de l'instruction de chaque dossier (soumission, validation, complément demandé, refus motivé).\n\nTous les documents sont filigranés côté serveur avec votre matricule et la date de génération, pour garantir leur authenticité.",
    body_ar:
      "تتوفر الآن خدمات جديدة على الفضاء الشخصي: مكتبة وثائقية تجمع كافة الوصولات والأذون والشهادات والإشعارات الصادرة عن الجمعية، مع تتبّع شفاف لكل ملف (الإيداع، المصادقة، طلب الاستكمال، الرفض المعلَّل).\n\nتُطبع جميع الوثائق بعلامة مائية من الخادم تتضمن رقم التسجيل وتاريخ الإصدار، ضماناً لأصالتها.",
  },
];
