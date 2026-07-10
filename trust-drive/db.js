/* ============================================================
   TRUST DRIVE — BASE DE CONNAISSANCES AUTOMOBILE v2
   Familles moteur réelles (défauts connus, coûts, fenêtres km),
   ~95 modèles / 30 marques du marché français, courbes de décote
   par segment. Sources : rappels constructeurs, TSB, retours
   ateliers et cotes marché publiques (valeurs indicatives).
   ============================================================ */
'use strict';

/* ---------- Courbes de rétention de valeur (âge 0 → 12 ans) ---------- */
const DEPRECIATION = {
  citadine:   [1,.85,.76,.68,.62,.57,.52,.48,.44,.40,.37,.34,.31],
  compacte:   [1,.84,.74,.66,.60,.55,.50,.46,.42,.38,.35,.32,.30],
  berline:    [1,.81,.70,.61,.54,.49,.44,.40,.37,.34,.31,.29,.27],
  suv:        [1,.85,.76,.68,.62,.57,.52,.48,.44,.41,.38,.35,.32],
  sport:      [1,.87,.79,.73,.68,.64,.61,.58,.56,.54,.52,.50,.48],
  supercar:   [1,.90,.85,.81,.78,.76,.74,.72,.71,.70,.69,.68,.67],
  electrique: [1,.76,.64,.55,.48,.43,.39,.35,.32,.29,.27,.25,.23]
};
const SEG_LABEL = {citadine:"Citadine",compacte:"Compacte",berline:"Berline",suv:"SUV / Crossover",sport:"Sportive",supercar:"GT / Supercar",electrique:"Électrique"};
const EXP_KM_YEAR = {citadine:12000,compacte:14000,berline:16000,suv:14000,sport:8000,supercar:3500,electrique:12000};
const MAINT_BASE = {citadine:450,compacte:560,berline:720,suv:660,sport:1400,supercar:3800,electrique:320};

/* ---------- Familles moteur (issues: t=texte, sev, cost€, km=seuil, yMax/yMin=années concernées, chk=contrôle sur place, ask=question vendeur) ---------- */
const ENGINES = {
  /* --- Groupe PSA / Stellantis --- */
  eb2_puretech:{label:"1.0–1.2 PureTech",fuel:"Essence",conso:5.4,rel:52,issues:[
    {t:"Courroie de distribution humide : dégradation dans l'huile — remplacement impératif entre 60 et 100 000 km (≈ 700 €)",sev:"bad",cost:700,km:45000,yMax:2022,chk:"Ouvrir le bouchon d'huile : dépôts noirs de courroie = fuyez",ask:"La courroie de distribution a-t-elle été remplacée ? Facture ?"},
    {t:"Consommation d'huile à surveiller (jusqu'à 0,5 L / 1 000 km sur certains blocs)",sev:"warn",km:50000,chk:"Contrôler le niveau d'huile moteur froid"},
    {t:"Pompe à eau et thermostat fragiles (≈ 300 €)",sev:"warn",cost:300,km:80000}]},
  psa_bluehdi15:{label:"1.5 BlueHDi",fuel:"Diesel",conso:4.2,rel:68,issues:[
    {t:"Capteurs et injecteur AdBlue capricieux (≈ 400 €)",sev:"warn",cost:400,km:80000,ask:"Des voyants AdBlue/dépollution sont-ils apparus ?"},
    {t:"Encrassement EGR/FAP en usage urbain exclusif",sev:"warn",km:60000,chk:"Essai routier : accélération franche, aucune fumée noire"}]},
  psa_bluehdi20:{label:"2.0 BlueHDi",fuel:"Diesel",conso:4.9,rel:76,issues:[
    {t:"FAP à contrôler au-delà de 150 000 km (≈ 800 € si colmaté)",sev:"warn",cost:800,km:150000}]},
  psa_thp:{label:"1.6 THP / PureTech turbo",fuel:"Essence",conso:6.8,rel:46,issues:[
    {t:"Chaîne de distribution et tendeur fragiles : cliquetis à froid = intervention 1 200 €",sev:"bad",cost:1200,km:60000,yMax:2019,chk:"Démarrage moteur froid : aucun cliquetis métallique les 5 premières secondes",ask:"La chaîne de distribution a-t-elle été remplacée ?"},
    {t:"Consommation d'huile et encrassement admission",sev:"warn",km:80000}]},
  psa_vti:{label:"1.4–1.6 VTi",fuel:"Essence",conso:6.2,rel:62,issues:[
    {t:"Chaîne de distribution à surveiller après 100 000 km",sev:"warn",cost:900,km:100000}]},
  ev_psa:{label:"Électrique (e-CMP 136 ch)",fuel:"Électrique",conso:"15,4 kWh",rel:74,issues:[
    {t:"Chargeur embarqué : quelques remplacements sous garantie recensés",sev:"warn",km:60000,ask:"Le véhicule est-il à jour de ses mises à jour constructeur ?"}]},

  /* --- Renault / Nissan / Dacia --- */
  ren_tce90:{label:"0.9–1.0 TCe 90–100",fuel:"Essence",conso:5.3,rel:60,issues:[
    {t:"Bobines et bougies à changer tôt (≈ 180 €)",sev:"warn",cost:180,km:60000},
    {t:"Embrayage parfois faible avant 100 000 km",sev:"warn",cost:800,km:80000,chk:"Essai : patinage en côte en 3e"}]},
  ren_tce_12:{label:"1.2 TCe 115–130 (av. 2018)",fuel:"Essence",conso:6.0,rel:44,issues:[
    {t:"Consommation d'huile excessive pouvant mener à la casse moteur — défaut notoire du 1.2 TCe",sev:"bad",cost:3500,km:60000,yMax:2018,chk:"Niveau d'huile + traces de rajouts fréquents dans le carnet",ask:"Le moteur a-t-il fait l'objet de la campagne de reprogrammation Renault ?"}]},
  ren_tce13:{label:"1.3 TCe 130–160",fuel:"Essence",conso:5.8,rel:70,issues:[
    {t:"Calaminage admission (injection directe) au-delà de 100 000 km",sev:"warn",cost:400,km:100000}]},
  ren_dci15:{label:"1.5 dCi / Blue dCi",fuel:"Diesel",conso:4.0,rel:70,issues:[
    {t:"Vanne EGR à nettoyer/remplacer (≈ 350 €)",sev:"warn",cost:350,km:100000},
    {t:"Injecteurs sensibles à la qualité du gazole après 130 000 km",sev:"warn",cost:900,km:130000}]},
  ren_etech:{label:"E-Tech hybride 140–145",fuel:"Hybride",conso:4.5,rel:72,issues:[
    {t:"Boîte à crabots : à-coups possibles à basse vitesse (mises à jour correctives)",sev:"warn",km:20000,chk:"Essai en ville : passages de rapports sans secousses"}]},
  ev_zoe:{label:"R90–R135 électrique",fuel:"Électrique",conso:"13,2 kWh",rel:78,issues:[
    {t:"Batterie parfois en LOCATION (39–120 €/mois à vie) : vérifiez le contrat",sev:"warn",ask:"La batterie est-elle en pleine propriété ou en location Diac ?"},
    {t:"Réducteur bruyant sur les premiers modèles",sev:"warn",yMax:2016,km:60000}]},
  ev_spring:{label:"Spring 45–65 électrique",fuel:"Électrique",conso:"13,9 kWh",rel:60,issues:[
    {t:"Charge lente (6,6 kW), finition économique, tenue de route limitée sur autoroute",sev:"warn"}]},

  /* --- Groupe VW --- */
  vag_ea211:{label:"1.0–1.5 TSI (EA211)",fuel:"Essence",conso:5.6,rel:76,issues:[
    {t:"Pompe à eau / thermostat à prévoir vers 90 000 km (≈ 350 €)",sev:"warn",cost:350,km:90000},
    {t:"1.5 TSI av. 2019 : à-coups à froid (« kangourou ») corrigés par mise à jour",sev:"warn",yMax:2019,chk:"Essai moteur froid : accélérations douces sans à-coups"}]},
  vag_ea111:{label:"1.2–1.4 TSI (EA111, av. 2015)",fuel:"Essence",conso:6.2,rel:42,issues:[
    {t:"Chaîne de distribution qui s'allonge : risque de casse — cliquetis à froid = 900 € minimum",sev:"bad",cost:900,km:60000,chk:"Démarrage à froid impératif : tout bruit de chaîne disqualifie",ask:"La chaîne et le tendeur ont-ils été remplacés ?"},
    {t:"Consommation d'huile importante sur les 1.4 TSI twincharger",sev:"bad",cost:2500,km:80000}]},
  vag_ea888:{label:"1.8–2.0 TSI (EA888)",fuel:"Essence",conso:7.0,rel:70,issues:[
    {t:"Consommation d'huile à surveiller (gén. antérieures à 2013 surtout)",sev:"warn",km:100000,chk:"Niveau + demander la fréquence des appoints"},
    {t:"Pompe à eau (≈ 400 €) et encrassement admission",sev:"warn",cost:400,km:90000}]},
  vag_ea288:{label:"1.6–2.0 TDI (EA288)",fuel:"Diesel",conso:4.6,rel:78,issues:[
    {t:"Vanne EGR à prévoir vers 130 000 km (≈ 600 €)",sev:"warn",cost:600,km:130000},
    {t:"Volant moteur bi-masse en fin de vie vers 150 000 km (≈ 900 €)",sev:"warn",cost:900,km:150000,chk:"Vibrations/claquements au ralenti embrayé"}]},

  /* --- BMW / Mini --- */
  bmw_n47:{label:"2.0d (N47, 2007–2014)",fuel:"Diesel",conso:5.0,rel:40,issues:[
    {t:"Chaîne de distribution (côté boîte !) : défaut notoire — casse = moteur HS, remplacement préventif 3 200 €",sev:"bad",cost:3200,km:80000,chk:"Moteur froid : bruit de chaîne à l'arrière du moteur = danger",ask:"La chaîne de distribution a-t-elle été refaite ? Facture ?"},
    {t:"Volant bi-masse et injecteurs sensibles",sev:"warn",cost:1100,km:140000}]},
  bmw_b47:{label:"2.0d (B47, 2014+)",fuel:"Diesel",conso:4.9,rel:65,issues:[
    {t:"Chaîne de distribution à surveiller au-delà de 120 000 km (2 500 € si usée)",sev:"warn",cost:2500,km:120000,chk:"Bruit métallique à froid",ask:"Des factures d'entretien récentes chez BMW ?"},
    {t:"Rappel refroidisseur EGR (risque incendie) : vérifier qu'il a été traité",sev:"warn",yMax:2019,ask:"Le rappel EGR a-t-il été effectué ?"}]},
  bmw_b48:{label:"1.5–2.0i (B38/B48)",fuel:"Essence",conso:6.4,rel:78,issues:[
    {t:"Pompe à eau électrique à prévoir vers 120 000 km (≈ 600 €)",sev:"warn",cost:600,km:120000}]},
  bmw_6cyl:{label:"3.0i 6 cylindres (B58/N55)",fuel:"Essence",conso:8.3,rel:74,issues:[
    {t:"Joint de carter et bobines : entretien préventif conseillé",sev:"warn",cost:500,km:110000}]},
  bmw_s55:{label:"3.0 S55 (M3/M4)",fuel:"Essence",conso:10.2,rel:60,issues:[
    {t:"Moyeu de vilebrequin (crank hub) : renfort préventif recommandé en usage circuit (≈ 3 000 €)",sev:"warn",cost:3000,ask:"Le crank hub a-t-il été traité ? Usage circuit ?"},
    {t:"Consommables sport très coûteux (freins ≈ 2 000 €/train)",sev:"warn",cost:2000,km:40000}]},

  /* --- Mercedes --- */
  mb_om651:{label:"2.1 CDI (OM651)",fuel:"Diesel",conso:5.2,rel:64,issues:[
    {t:"Injecteurs Delphi défaillants sur les premières années (pris en charge tardivement)",sev:"bad",cost:1500,yMax:2011,km:60000,ask:"Les injecteurs ont-ils été remplacés (campagne Mercedes) ?"},
    {t:"Chaîne de distribution à écouter après 150 000 km",sev:"warn",cost:1800,km:150000}]},
  mb_om654:{label:"2.0d (OM654)",fuel:"Diesel",conso:4.7,rel:82,issues:[]},
  mb_m270:{label:"1.3–2.0 essence (M270/M282)",fuel:"Essence",conso:6.1,rel:74,issues:[
    {t:"Chaîne de distribution à contrôler après 130 000 km",sev:"warn",cost:1200,km:130000}]},

  /* --- Ford --- */
  ford_eco10:{label:"1.0 EcoBoost",fuel:"Essence",conso:5.9,rel:48,issues:[
    {t:"Courroie de distribution baignant dans l'huile : dégradation précoce — remplacement ≈ 900 € impératif",sev:"bad",cost:900,km:60000,chk:"Dépôts dans le carter d'huile ; historique des vidanges (huile spécifique WSS)",ask:"La courroie humide a-t-elle été remplacée ? Avec la bonne huile ?"},
    {t:"Durites de refroidissement / risque de surchauffe sur les premières séries",sev:"bad",cost:1200,yMax:2014,km:60000}]},
  ford_eco15:{label:"1.5 EcoBoost",fuel:"Essence",conso:6.4,rel:64,issues:[
    {t:"Sondes et thermostat fragiles",sev:"warn",cost:300,km:90000}]},
  ford_tdci:{label:"1.5 TDCi / EcoBlue",fuel:"Diesel",conso:4.3,rel:66,issues:[
    {t:"Injecteurs et EGR à surveiller après 120 000 km",sev:"warn",cost:700,km:120000}]},

  /* --- Toyota / Lexus / Honda / Mazda / Suzuki --- */
  toy_hsd:{label:"Hybride HSD",fuel:"Hybride",conso:4.3,rel:90,issues:[
    {t:"Batterie hybride : rarement avant 250 000 km (≈ 1 500 € reconditionnée)",sev:"warn",cost:1500,km:200000},
    {t:"Freins arrière qui grippent si le véhicule roule peu",sev:"warn",km:60000,chk:"Contrôler l'état des disques arrière"}]},
  toy_atmo:{label:"1.0–1.5 VVT-i",fuel:"Essence",conso:5.4,rel:86,issues:[]},
  honda_turbo:{label:"1.0–1.5 VTEC Turbo",fuel:"Essence",conso:6.0,rel:78,issues:[
    {t:"Dilution d'huile par l'essence sur 1.0/1.5 première génération (trajets courts)",sev:"warn",yMax:2019,chk:"Odeur d'essence sur la jauge d'huile"}]},
  mazda_sky:{label:"Skyactiv-G 2.0",fuel:"Essence",conso:6.1,rel:86,issues:[]},
  suzuki_jet:{label:"1.0–1.4 Boosterjet / Dualjet",fuel:"Essence",conso:5.2,rel:82,issues:[]},

  /* --- Hyundai / Kia --- */
  hk_tgdi:{label:"1.0–1.6 T-GDI",fuel:"Essence",conso:6.0,rel:70,issues:[
    {t:"Calaminage admission (injection directe) après 90 000 km",sev:"warn",cost:400,km:90000}]},
  hk_crdi:{label:"1.6 CRDi",fuel:"Diesel",conso:4.4,rel:72,issues:[
    {t:"FAP en usage urbain : régénérations à vérifier",sev:"warn",km:80000}]},
  hk_hev:{label:"Hybride 141–230",fuel:"Hybride",conso:4.8,rel:78,issues:[]},
  hk_ev:{label:"Électrique 136–204",fuel:"Électrique",conso:"15,0 kWh",rel:74,issues:[
    {t:"Kona EV : rappel batterie LG (risque incendie) — vérifier le remplacement",sev:"bad",yMax:2021,ask:"Le rappel batterie a-t-il été réalisé ? Justificatif ?"}]},

  /* --- Fiat / Alfa / Jeep --- */
  fiat_fire:{label:"1.2 69 Fire / FireFly",fuel:"Essence",conso:5.6,rel:70,issues:[]},
  fiat_twinair:{label:"0.9 TwinAir",fuel:"Essence",conso:6.2,rel:50,issues:[
    {t:"Consommation d'huile et distribution fragile — bien plus gourmand que l'homologation",sev:"warn",cost:600,km:70000}]},
  fiat_multiair:{label:"1.4 MultiAir",fuel:"Essence",conso:6.3,rel:55,issues:[
    {t:"Actuateur MultiAir défaillant (≈ 900 €)",sev:"warn",cost:900,km:80000}]},
  fiat_mjet:{label:"1.3–1.6 MultiJet",fuel:"Diesel",conso:4.5,rel:68,issues:[
    {t:"EGR et FAP à surveiller",sev:"warn",km:100000}]},
  alfa_22d:{label:"2.2 Diesel 150–210",fuel:"Diesel",conso:5.3,rel:65,issues:[
    {t:"EGR et capteurs : passages atelier fréquents les 2 premières années",sev:"warn",yMax:2018}]},
  alfa_veloce:{label:"2.0 Turbo 200–280",fuel:"Essence",conso:7.4,rel:68,issues:[
    {t:"Électronique embarquée capricieuse (capteurs, infotainment)",sev:"warn"}]},

  /* --- Opel (pré-PSA) --- */
  opel_sge:{label:"1.0–1.4 Turbo (av. 2019)",fuel:"Essence",conso:6.0,rel:60,issues:[
    {t:"Chaîne de distribution bruyante sur 1.0/1.4 Turbo",sev:"warn",cost:800,km:90000}]},
  opel_cdti:{label:"1.6 CDTI",fuel:"Diesel",conso:4.4,rel:66,issues:[
    {t:"Vanne EGR et FAP à surveiller",sev:"warn",km:100000}]},

  /* --- Volvo / Tesla --- */
  volvo_de:{label:"2.0 Drive-E (D3/D4/T4/B4)",fuel:"Diesel",conso:5.0,rel:74,issues:[
    {t:"Courroie de distribution à respecter scrupuleusement (120 000 km)",sev:"warn",cost:700,km:110000}]},
  tesla_3y:{label:"Électrique (SR+/LR/Perf)",fuel:"Électrique",conso:"14,9 kWh",rel:72,issues:[
    {t:"Bras de suspension avant : jeu prématuré possible (≈ 400 €)",sev:"warn",cost:400,km:80000},
    {t:"Qualité d'assemblage variable avant 2021 (joints, alignements)",sev:"warn",yMax:2021,chk:"Inspecter ajustements de carrosserie et infiltrations coffre"},
    {t:"Dégradation batterie normale ≈ 8 % à 150 000 km : vérifier l'autonomie réelle",sev:"warn",km:150000,chk:"Charge à 100 % et relever l'autonomie affichée"}]},
  tesla_s:{label:"Électrique (75D–P100D)",fuel:"Électrique",conso:"18,5 kWh",rel:64,issues:[
    {t:"Écran MCU1 (av. 2018) : défaillance mémoire connue (≈ 1 800 €)",sev:"bad",cost:1800,yMax:2018,ask:"Le MCU a-t-il été remplacé/upgradé ?"},
    {t:"Poignées affleurantes et suspension pneumatique coûteuses",sev:"warn",cost:900,km:120000}]},

  /* --- Land Rover / Jaguar --- */
  jlr_ing_d:{label:"2.0d Ingenium",fuel:"Diesel",conso:5.5,rel:45,issues:[
    {t:"Chaîne de distribution défaillante sur les premières années (casse recensées) — 2 800 €",sev:"bad",cost:2800,km:80000,yMax:2019,chk:"Bruit de chaîne à froid ; exiger l'historique complet",ask:"La chaîne a-t-elle été remplacée ? Entretien 100 % réseau ?"},
    {t:"Électronique et capteurs : pannes récurrentes hors garantie",sev:"warn",cost:600}]},
  jlr_ing_p:{label:"2.0 Ingenium essence",fuel:"Essence",conso:7.6,rel:58,issues:[
    {t:"Fiabilité électronique moyenne : privilégier un historique réseau complet",sev:"warn"}]},

  /* --- Porsche --- */
  por_flat6:{label:"Flat-6 3.0–4.0",fuel:"Essence",conso:9.6,rel:82,issues:[
    {t:"Entretien exclusivement spécialiste/centre Porsche recommandé (vidange PDK 60 000 km)",sev:"warn",cost:600,km:60000,ask:"Carnet tamponné centre Porsche ou spécialiste reconnu ?"}]},
  por_flat4:{label:"Flat-4 2.0–2.5 (718)",fuel:"Essence",conso:8.4,rel:74,issues:[
    {t:"Rien de rédhibitoire ; décote plus marquée que les 6 cylindres",sev:"warn"}]},
  por_v6:{label:"V6 3.0 (Macan/Cayenne)",fuel:"Essence",conso:9.8,rel:72,issues:[
    {t:"Boîtier de transfert (Macan) à surveiller après 100 000 km (≈ 1 500 €)",sev:"warn",cost:1500,km:100000},
    {t:"Fuites carter/joints possibles avec l'âge",sev:"warn",cost:800,km:120000}]},
  por_ev:{label:"Taycan électrique",fuel:"Électrique",conso:"20 kWh",rel:75,issues:[
    {t:"Rappel batterie 12 V sur premiers millésimes",sev:"warn",yMax:2021,ask:"Rappels constructeur soldés ?"}]},

  /* --- Exotiques --- */
  fer_v8:{label:"V8 Ferrari 3.9–4.5",fuel:"Essence",conso:13.5,rel:76,issues:[
    {t:"Entretien annuel obligatoire (≈ 1 800 €/an) — programme « Genuine Maintenance » 7 ans sur 458+",sev:"warn",cost:1800,ask:"Carnet concession complet ? Dernière révision ?"},
    {t:"Vérifier l'absence de témoins « slow down » et l'état des silentblocs moteur",sev:"warn",chk:"Diagnostic OBD Ferrari (SD3) avant achat fortement conseillé"}]},
  lam_gallardo:{label:"V10 5.0–5.2 (Gallardo)",fuel:"Essence",conso:15.0,rel:62,issues:[
    {t:"Boîte e-gear : embrayage robotisé à durée de vie courte — relevé d'usure indispensable (remplacement 8 000–10 000 €)",sev:"bad",cost:9000,km:20000,chk:"Faire lire le pourcentage d'usure embrayage à la valise",ask:"Quel est le relevé d'usure e-gear ? Factures d'embrayage ?"},
    {t:"Entretien annuel ≈ 2 000 € ; suspension et supports moteur à contrôler",sev:"warn",cost:2000}]},
  lam_huracan:{label:"V10 5.2 (Huracán 580–640)",fuel:"Essence",conso:14.0,rel:80,issues:[
    {t:"Boîte LDF7 double embrayage réputée robuste ; vidange régulière impérative",sev:"warn",cost:1200,ask:"Historique d'entretien réseau Lamborghini complet ?"},
    {t:"Consommables élevés : pneus ≈ 1 200 €/train, freins carbone-céramique très coûteux si équipé",sev:"warn",cost:1200,km:15000,chk:"Mesurer les disques ; vérifier l'absence d'usage piste intensif"}]},
  lam_v12:{label:"V12 6.5 (Aventador)",fuel:"Essence",conso:18.0,rel:70,issues:[
    {t:"Boîte ISR mono-embrayage : embrayage ≈ 6 000 € (20–30 000 km en usage sportif)",sev:"warn",cost:6000,km:20000,ask:"Relevé d'usure embrayage ISR ?"},
    {t:"Entretien annuel ≈ 2 500 € minimum",sev:"warn",cost:2500}]},
  lam_urus:{label:"V8 4.0 biturbo (Urus)",fuel:"Essence",conso:12.7,rel:70,issues:[
    {t:"Consommables démesurés : freins ≈ 6 000 €, pneus 23\" ≈ 2 000 €/train",sev:"warn",cost:2000,km:15000}]},
  mas_v6:{label:"3.0 V6 (Ghibli/Levante)",fuel:"Essence",conso:9.5,rel:55,issues:[
    {t:"Chaînes et tendeurs à écouter dès 90 000 km (≈ 1 800 €)",sev:"warn",cost:1800,km:90000},
    {t:"Électronique et multimédia capricieux ; réseau SAV limité",sev:"warn"},
    {t:"Décote très forte : négociez agressivement, revente difficile",sev:"warn"}]},
  aston_v8:{label:"V8 4.0 biturbo (AMG)",fuel:"Essence",conso:11.5,rel:72,issues:[
    {t:"Base moteur AMG fiable ; électronique Aston à vérifier poste par poste",sev:"warn",chk:"Tester chaque équipement (vitres, clim, infotainment)"}]},
  mcl_v8:{label:"V8 3.8–4.0 (McLaren)",fuel:"Essence",conso:12.5,rel:58,issues:[
    {t:"Fuites hydrauliques suspension et pannes électroniques récurrentes hors garantie",sev:"bad",cost:3000,km:15000,ask:"Extension de garantie McLaren en cours ?"},
    {t:"Entretien annuel ≈ 2 000 € ; historique concession indispensable",sev:"warn",cost:2000}]},
  bentley_w12:{label:"W12 6.0 / V8 4.0",fuel:"Essence",conso:14.0,rel:70,issues:[
    {t:"Suspension pneumatique et électronique : budget entretien ≈ 3 000 €/an",sev:"warn",cost:3000}]}
};

/* ---------- Boîtes automatiques à risque connu ---------- */
const GEARBOXES = {
  dq200:{label:"DSG7 à sec (DQ200)",issues:[
    {t:"Mécatronique et embrayages DSG7 DQ200 : à-coups puis panne — 2 000 € (véhicules 60–140 000 km les plus touchés)",sev:"bad",cost:2000,km:60000,chk:"Essai : à-coups 1→2 à froid, recul en côte, vibrations au démarrage",ask:"La mécatronique a-t-elle été remplacée ? Mises à jour faites ?"}]},
  dsg_wet:{label:"DSG6/7 à bain d'huile",issues:[
    {t:"Vidange DSG obligatoire tous les 60 000 km (≈ 250 €) — exiger les factures",sev:"warn",cost:250,km:55000,ask:"Vidanges de boîte DSG faites aux intervalles ?"}]},
  edc:{label:"EDC double embrayage",issues:[
    {t:"Boîte EDC : à-coups et usure prématurée possibles (≈ 1 800 € hors garantie)",sev:"warn",cost:1800,km:70000,chk:"Essai en ville : passages 1→2 sans secousse"}]},
  zf8:{label:"BVA8 ZF",issues:[
    {t:"BVA ZF8 très fiable ; vidange conseillée vers 100 000 km (≈ 350 €)",sev:"warn",cost:350,km:100000}]},
  pdk:{label:"PDK",issues:[]},
  dct7_mb:{label:"7G/8G-DCT",issues:[
    {t:"Vidange boîte double embrayage à respecter (60–80 000 km)",sev:"warn",cost:300,km:70000}]}
};

/* ---------- Marques & modèles ----------
   m: {name, alias[], seg, y:[de,à], np: prix neuf représentatif €,
       eng: [{ref, p: ch, box:"m"|"a"|"ma", abox: id GEARBOXES}] } */
const BRANDS = [
{name:"Peugeot",alias:["peugeot"],tier:1,models:[
  {name:"208 (2012–2019)",alias:["208"],seg:"citadine",y:[2012,2019],np:18000,eng:[{ref:"eb2_puretech",p:110,box:"m"},{ref:"psa_vti",p:82,box:"m"},{ref:"psa_bluehdi15",p:100,box:"m"}]},
  {name:"208 II (2019+)",alias:["208"],seg:"citadine",y:[2019,2026],np:22500,eng:[{ref:"eb2_puretech",p:100,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:100,box:"m"},{ref:"ev_psa",p:136,box:"a"}]},
  {name:"308 II (2013–2021)",alias:["308"],seg:"compacte",y:[2013,2021],np:27000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi20",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"308 III (2021+)",alias:["308"],seg:"compacte",y:[2021,2026],np:33000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:130,box:"a",abox:"dsg_wet"}]},
  {name:"2008 II",alias:["2008"],seg:"suv",y:[2019,2026],np:27000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:110,box:"m"},{ref:"ev_psa",p:136,box:"a"}]},
  {name:"3008 II",alias:["3008"],seg:"suv",y:[2016,2023],np:33000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi20",p:180,box:"a",abox:"dsg_wet"}]},
  {name:"5008 II",alias:["5008"],seg:"suv",y:[2017,2024],np:36000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:130,box:"ma",abox:"dsg_wet"}]},
  {name:"508 II",alias:["508"],seg:"berline",y:[2018,2026],np:38000,eng:[{ref:"psa_thp",p:180,box:"a",abox:"dsg_wet"},{ref:"psa_bluehdi20",p:160,box:"a",abox:"dsg_wet"}]}]},
{name:"Renault",alias:["renault"],tier:1,models:[
  {name:"Clio IV",alias:["clio"],seg:"citadine",y:[2012,2019],np:17500,eng:[{ref:"ren_tce90",p:90,box:"m"},{ref:"ren_tce_12",p:120,box:"ma",abox:"edc"},{ref:"ren_dci15",p:90,box:"m"}]},
  {name:"Clio V",alias:["clio"],seg:"citadine",y:[2019,2026],np:20000,eng:[{ref:"ren_tce90",p:100,box:"m"},{ref:"ren_tce13",p:130,box:"a",abox:"edc"},{ref:"ren_etech",p:140,box:"a"},{ref:"ren_dci15",p:100,box:"m"}]},
  {name:"Captur II",alias:["captur"],seg:"suv",y:[2019,2026],np:25000,eng:[{ref:"ren_tce90",p:90,box:"m"},{ref:"ren_tce13",p:140,box:"ma",abox:"edc"},{ref:"ren_etech",p:145,box:"a"}]},
  {name:"Mégane IV",alias:["megane","mégane"],seg:"compacte",y:[2016,2024],np:28000,eng:[{ref:"ren_tce13",p:140,box:"ma",abox:"edc"},{ref:"ren_dci15",p:115,box:"ma",abox:"edc"}]},
  {name:"Twingo III",alias:["twingo"],seg:"citadine",y:[2014,2024],np:14500,eng:[{ref:"ren_tce90",p:90,box:"ma",abox:"edc"}]},
  {name:"Kadjar",alias:["kadjar"],seg:"suv",y:[2015,2022],np:29000,eng:[{ref:"ren_tce13",p:140,box:"ma",abox:"edc"},{ref:"ren_dci15",p:115,box:"m"}]},
  {name:"Arkana",alias:["arkana"],seg:"suv",y:[2021,2026],np:31000,eng:[{ref:"ren_tce13",p:140,box:"a",abox:"edc"},{ref:"ren_etech",p:145,box:"a"}]},
  {name:"Scénic IV",alias:["scenic","scénic"],seg:"compacte",y:[2016,2023],np:30000,eng:[{ref:"ren_tce13",p:140,box:"ma",abox:"edc"},{ref:"ren_dci15",p:110,box:"m"}]},
  {name:"Zoé",alias:["zoe","zoé"],seg:"electrique",y:[2013,2024],np:33000,eng:[{ref:"ev_zoe",p:110,box:"a"}]}]},
{name:"Citroën",alias:["citroen","citroën"],tier:1,models:[
  {name:"C3 III",alias:["c3"],seg:"citadine",y:[2016,2026],np:19000,eng:[{ref:"eb2_puretech",p:110,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:100,box:"m"}]},
  {name:"C3 Aircross",alias:["c3 aircross","aircross"],seg:"suv",y:[2017,2026],np:23000,eng:[{ref:"eb2_puretech",p:110,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:110,box:"m"}]},
  {name:"C4 III",alias:["c4"],seg:"compacte",y:[2020,2026],np:28000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"ev_psa",p:136,box:"a"}]},
  {name:"C5 Aircross",alias:["c5 aircross","c5"],seg:"suv",y:[2018,2026],np:32000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"psa_bluehdi15",p:130,box:"a",abox:"dsg_wet"}]},
  {name:"Berlingo",alias:["berlingo"],seg:"suv",y:[2018,2026],np:26000,eng:[{ref:"eb2_puretech",p:110,box:"m"},{ref:"psa_bluehdi15",p:130,box:"ma",abox:"dsg_wet"}]}]},
{name:"DS",alias:["ds automobiles","ds3","ds4","ds7","ds "],tier:2,models:[
  {name:"DS3 (2010–2019)",alias:["ds3","ds 3"],seg:"citadine",y:[2010,2019],np:22000,eng:[{ref:"psa_vti",p:120,box:"m"},{ref:"psa_thp",p:155,box:"m"},{ref:"psa_bluehdi15",p:100,box:"m"}]},
  {name:"DS7 Crossback",alias:["ds7","ds 7"],seg:"suv",y:[2018,2026],np:42000,eng:[{ref:"psa_thp",p:180,box:"a",abox:"dsg_wet"},{ref:"psa_bluehdi20",p:180,box:"a",abox:"dsg_wet"}]}]},
{name:"Dacia",alias:["dacia"],tier:1,models:[
  {name:"Sandero II/III",alias:["sandero"],seg:"citadine",y:[2013,2026],np:13500,eng:[{ref:"ren_tce90",p:90,box:"m"},{ref:"ren_dci15",p:95,box:"m"}]},
  {name:"Duster II",alias:["duster"],seg:"suv",y:[2018,2026],np:19500,eng:[{ref:"ren_tce13",p:130,box:"m"},{ref:"ren_dci15",p:115,box:"m"}]},
  {name:"Spring",alias:["spring"],seg:"electrique",y:[2021,2026],np:19000,eng:[{ref:"ev_spring",p:45,box:"a"}]}]},
{name:"Volkswagen",alias:["volkswagen","vw"],tier:1,models:[
  {name:"Polo V (2009–2017)",alias:["polo"],seg:"citadine",y:[2009,2017],np:17500,eng:[{ref:"vag_ea111",p:105,box:"ma",abox:"dq200"},{ref:"vag_ea288",p:90,box:"m"}]},
  {name:"Polo VI (2017+)",alias:["polo"],seg:"citadine",y:[2017,2026],np:21000,eng:[{ref:"vag_ea211",p:95,box:"ma",abox:"dq200"},{ref:"vag_ea288",p:95,box:"m"}]},
  {name:"Golf 7",alias:["golf"],seg:"compacte",y:[2012,2020],np:28000,eng:[{ref:"vag_ea211",p:125,box:"ma",abox:"dq200"},{ref:"vag_ea888",p:245,box:"ma",abox:"dsg_wet",npx:1.38,segx:"sport"},{ref:"vag_ea288",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"Golf 8",alias:["golf"],seg:"compacte",y:[2020,2026],np:32000,eng:[{ref:"vag_ea211",p:130,box:"ma",abox:"dq200"},{ref:"vag_ea888",p:245,box:"a",abox:"dsg_wet",npx:1.35,segx:"sport"},{ref:"vag_ea288",p:150,box:"a",abox:"dsg_wet"}]},
  {name:"Tiguan II",alias:["tiguan"],seg:"suv",y:[2016,2024],np:36000,eng:[{ref:"vag_ea211",p:150,box:"ma",abox:"dsg_wet"},{ref:"vag_ea288",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"T-Roc",alias:["t-roc","troc"],seg:"suv",y:[2017,2026],np:29000,eng:[{ref:"vag_ea211",p:110,box:"ma",abox:"dq200"},{ref:"vag_ea288",p:115,box:"m"}]},
  {name:"Passat B8",alias:["passat"],seg:"berline",y:[2014,2023],np:36000,eng:[{ref:"vag_ea288",p:150,box:"ma",abox:"dsg_wet"},{ref:"vag_ea888",p:190,box:"a",abox:"dsg_wet"}]},
  {name:"up!",alias:["up!","vw up"],seg:"citadine",y:[2012,2023],np:13500,eng:[{ref:"vag_ea211",p:75,box:"m"}]}]},
{name:"Audi",alias:["audi"],tier:2,models:[
  {name:"A1 (GB)",alias:["a1"],seg:"citadine",y:[2018,2026],np:26000,eng:[{ref:"vag_ea211",p:110,box:"ma",abox:"dq200"}]},
  {name:"A3 (8V/8Y)",alias:["a3"],seg:"compacte",y:[2012,2026],np:33000,eng:[{ref:"vag_ea211",p:110,box:"ma",abox:"dq200"},{ref:"vag_ea888",p:190,box:"a",abox:"dsg_wet"},{ref:"vag_ea288",p:116,box:"ma",abox:"dq200"}]},
  {name:"A4 B9",alias:["a4"],seg:"berline",y:[2015,2025],np:42000,eng:[{ref:"vag_ea888",p:190,box:"a",abox:"dsg_wet"},{ref:"vag_ea288",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"Q3 II",alias:["q3"],seg:"suv",y:[2018,2026],np:40000,eng:[{ref:"vag_ea211",p:150,box:"a",abox:"dsg_wet"},{ref:"vag_ea288",p:150,box:"a",abox:"dsg_wet"}]},
  {name:"Q5 (FY)",alias:["q5"],seg:"suv",y:[2017,2026],np:52000,eng:[{ref:"vag_ea288",p:190,box:"a",abox:"dsg_wet"},{ref:"vag_ea888",p:252,box:"a",abox:"dsg_wet"}]},
  {name:"TT (8S)",alias:["tt"],seg:"sport",y:[2014,2023],np:44000,eng:[{ref:"vag_ea888",p:230,box:"ma",abox:"dsg_wet"}]}]},
{name:"BMW",alias:["bmw"],tier:2,models:[
  {name:"Série 1 (F20)",alias:["serie 1","série 1","116","118","120"],seg:"compacte",y:[2011,2019],np:29000,eng:[{ref:"bmw_n47",p:116,box:"ma",abox:"zf8"},{ref:"bmw_b47",p:150,box:"ma",abox:"zf8"},{ref:"bmw_b48",p:136,box:"ma",abox:"zf8"}]},
  {name:"Série 1 (F40)",alias:["serie 1","série 1","118i","118d"],seg:"compacte",y:[2019,2026],np:32000,eng:[{ref:"bmw_b48",p:140,box:"ma",abox:"dq200"},{ref:"bmw_b47",p:150,box:"a",abox:"zf8"}]},
  {name:"Série 3 (F30)",alias:["serie 3","série 3","316","318","320","330","335"],seg:"berline",y:[2012,2019],np:44000,eng:[{ref:"bmw_n47",p:184,box:"ma",abox:"zf8"},{ref:"bmw_b47",p:190,box:"ma",abox:"zf8"},{ref:"bmw_b48",p:184,box:"a",abox:"zf8"},{ref:"bmw_6cyl",p:326,box:"a",abox:"zf8"}]},
  {name:"Série 3 (G20)",alias:["serie 3","série 3","318d","320d","330i","330e"],seg:"berline",y:[2019,2026],np:46000,eng:[{ref:"bmw_b47",p:190,box:"a",abox:"zf8"},{ref:"bmw_b48",p:184,box:"a",abox:"zf8"}]},
  {name:"X1 (F48)",alias:["x1"],seg:"suv",y:[2015,2022],np:38000,eng:[{ref:"bmw_b47",p:150,box:"ma",abox:"zf8"},{ref:"bmw_b48",p:140,box:"ma",abox:"zf8"}]},
  {name:"X3 (G01)",alias:["x3"],seg:"suv",y:[2017,2026],np:52000,eng:[{ref:"bmw_b47",p:190,box:"a",abox:"zf8"},{ref:"bmw_b48",p:184,box:"a",abox:"zf8"}]},
  {name:"Série 5 (G30)",alias:["serie 5","série 5","520d","530d","530e"],seg:"berline",y:[2017,2024],np:55000,eng:[{ref:"bmw_b47",p:190,box:"a",abox:"zf8"},{ref:"bmw_6cyl",p:265,box:"a",abox:"zf8"}]},
  {name:"Z4 (G29)",alias:["z4"],seg:"sport",y:[2018,2026],np:50000,eng:[{ref:"bmw_b48",p:197,box:"a",abox:"zf8"},{ref:"bmw_6cyl",p:340,box:"a",abox:"zf8"}]},
  {name:"M3/M4 (F80/F82)",alias:["m3","m4"],seg:"sport",y:[2014,2020],np:85000,eng:[{ref:"bmw_s55",p:431,box:"ma",abox:"dsg_wet"}]}]},
{name:"Mercedes-Benz",alias:["mercedes","mercedes-benz"],tier:2,models:[
  {name:"Classe A (W176)",alias:["classe a","a180","a200","a220"],seg:"compacte",y:[2012,2018],np:31000,eng:[{ref:"mb_m270",p:156,box:"ma",abox:"dct7_mb"},{ref:"mb_om651",p:136,box:"ma",abox:"dct7_mb"}]},
  {name:"Classe A (W177)",alias:["classe a","a180","a200","a250"],seg:"compacte",y:[2018,2026],np:34000,eng:[{ref:"mb_m270",p:163,box:"a",abox:"dct7_mb"},{ref:"ren_dci15",p:116,box:"a",abox:"dct7_mb"}]},
  {name:"Classe C (W205)",alias:["classe c","c180","c200","c220","c250"],seg:"berline",y:[2014,2021],np:44000,eng:[{ref:"mb_om651",p:170,box:"a",abox:"dct7_mb"},{ref:"mb_om654",p:194,box:"a"},{ref:"mb_m270",p:184,box:"a",abox:"dct7_mb"}]},
  {name:"GLA (H247)",alias:["gla"],seg:"suv",y:[2020,2026],np:42000,eng:[{ref:"mb_m270",p:163,box:"a",abox:"dct7_mb"},{ref:"mb_om654",p:150,box:"a"}]},
  {name:"GLC (X253)",alias:["glc"],seg:"suv",y:[2015,2022],np:52000,eng:[{ref:"mb_om651",p:170,box:"a"},{ref:"mb_om654",p:194,box:"a"}]}]},
{name:"Mini",alias:["mini","cooper"],tier:2,models:[
  {name:"Cooper (R56)",alias:["cooper","mini cooper"],seg:"citadine",y:[2007,2013],np:22000,eng:[{ref:"psa_vti",p:122,box:"m"},{ref:"psa_thp",p:184,box:"m"}]},
  {name:"Cooper (F56)",alias:["cooper","mini cooper"],seg:"citadine",y:[2014,2026],np:26000,eng:[{ref:"bmw_b48",p:136,box:"ma",abox:"dq200"},{ref:"bmw_b48",p:192,box:"ma",abox:"dsg_wet"}]}]},
{name:"Toyota",alias:["toyota"],tier:1,models:[
  {name:"Yaris III/IV",alias:["yaris"],seg:"citadine",y:[2011,2026],np:21000,eng:[{ref:"toy_hsd",p:116,box:"a"},{ref:"toy_atmo",p:72,box:"m"}]},
  {name:"Corolla XII",alias:["corolla"],seg:"compacte",y:[2019,2026],np:30000,eng:[{ref:"toy_hsd",p:122,box:"a"},{ref:"toy_hsd",p:184,box:"a"}]},
  {name:"C-HR",alias:["c-hr","chr"],seg:"suv",y:[2016,2026],np:31000,eng:[{ref:"toy_hsd",p:122,box:"a"}]},
  {name:"RAV4 V",alias:["rav4","rav 4"],seg:"suv",y:[2019,2026],np:40000,eng:[{ref:"toy_hsd",p:218,box:"a"}]},
  {name:"Aygo",alias:["aygo"],seg:"citadine",y:[2014,2026],np:14000,eng:[{ref:"toy_atmo",p:72,box:"m"}]}]},
{name:"Lexus",alias:["lexus"],tier:2,models:[
  {name:"CT 200h",alias:["ct200h","ct 200h"],seg:"compacte",y:[2011,2020],np:31000,eng:[{ref:"toy_hsd",p:136,box:"a"}]},
  {name:"NX",alias:["nx"],seg:"suv",y:[2014,2026],np:50000,eng:[{ref:"toy_hsd",p:197,box:"a"}]}]},
{name:"Honda",alias:["honda"],tier:1,models:[
  {name:"Civic X",alias:["civic"],seg:"compacte",y:[2017,2022],np:27000,eng:[{ref:"honda_turbo",p:126,box:"m"},{ref:"honda_turbo",p:182,box:"ma"}]},
  {name:"Jazz IV",alias:["jazz"],seg:"citadine",y:[2020,2026],np:24000,eng:[{ref:"toy_hsd",p:109,box:"a"}]}]},
{name:"Mazda",alias:["mazda"],tier:1,models:[
  {name:"Mazda3 IV",alias:["mazda3","mazda 3"],seg:"compacte",y:[2019,2026],np:28000,eng:[{ref:"mazda_sky",p:122,box:"ma",abox:"zf8"}]},
  {name:"CX-5 II",alias:["cx-5","cx5"],seg:"suv",y:[2017,2026],np:35000,eng:[{ref:"mazda_sky",p:165,box:"ma",abox:"zf8"}]},
  {name:"MX-5 (ND)",alias:["mx-5","mx5","miata"],seg:"sport",y:[2015,2026],np:32000,eng:[{ref:"mazda_sky",p:132,box:"m"},{ref:"mazda_sky",p:184,box:"m"}]}]},
{name:"Suzuki",alias:["suzuki"],tier:1,models:[
  {name:"Swift VI",alias:["swift"],seg:"citadine",y:[2017,2026],np:17500,eng:[{ref:"suzuki_jet",p:90,box:"m"},{ref:"suzuki_jet",p:129,box:"m"}]}]},
{name:"Nissan",alias:["nissan"],tier:1,models:[
  {name:"Qashqai II/III",alias:["qashqai"],seg:"suv",y:[2014,2026],np:31000,eng:[{ref:"ren_tce13",p:140,box:"ma",abox:"edc"},{ref:"ren_dci15",p:115,box:"m"}]},
  {name:"Juke II",alias:["juke"],seg:"suv",y:[2019,2026],np:25000,eng:[{ref:"ren_tce90",p:114,box:"ma",abox:"edc"}]},
  {name:"Micra (K14)",alias:["micra"],seg:"citadine",y:[2017,2023],np:17000,eng:[{ref:"ren_tce90",p:92,box:"m"},{ref:"ren_dci15",p:90,box:"m"}]}]},
{name:"Ford",alias:["ford"],tier:1,models:[
  {name:"Fiesta VII",alias:["fiesta"],seg:"citadine",y:[2017,2023],np:19000,eng:[{ref:"ford_eco10",p:100,box:"m"},{ref:"toy_atmo",p:75,box:"m"}]},
  {name:"Focus IV",alias:["focus"],seg:"compacte",y:[2018,2025],np:27000,eng:[{ref:"ford_eco10",p:125,box:"ma",abox:"dsg_wet"},{ref:"ford_eco15",p:150,box:"ma"},{ref:"ford_tdci",p:120,box:"m"}]},
  {name:"Puma",alias:["puma"],seg:"suv",y:[2020,2026],np:27000,eng:[{ref:"ford_eco10",p:125,box:"ma",abox:"dsg_wet"}]},
  {name:"Kuga III",alias:["kuga"],seg:"suv",y:[2020,2026],np:35000,eng:[{ref:"ford_eco15",p:150,box:"ma"},{ref:"ford_tdci",p:120,box:"ma"}]}]},
{name:"Opel",alias:["opel"],tier:1,models:[
  {name:"Corsa E (2014–2019)",alias:["corsa"],seg:"citadine",y:[2014,2019],np:16500,eng:[{ref:"opel_sge",p:100,box:"m"},{ref:"opel_cdti",p:95,box:"m"}]},
  {name:"Corsa F (2019+)",alias:["corsa"],seg:"citadine",y:[2019,2026],np:20000,eng:[{ref:"eb2_puretech",p:100,box:"ma",abox:"dsg_wet"},{ref:"ev_psa",p:136,box:"a"}]},
  {name:"Astra K",alias:["astra"],seg:"compacte",y:[2015,2021],np:25000,eng:[{ref:"opel_sge",p:105,box:"m"},{ref:"opel_cdti",p:110,box:"m"}]},
  {name:"Mokka B",alias:["mokka"],seg:"suv",y:[2021,2026],np:26000,eng:[{ref:"eb2_puretech",p:130,box:"ma",abox:"dsg_wet"},{ref:"ev_psa",p:136,box:"a"}]}]},
{name:"Fiat",alias:["fiat"],tier:1,models:[
  {name:"500 (2007–2024)",alias:["500"],seg:"citadine",y:[2007,2024],np:16500,eng:[{ref:"fiat_fire",p:69,box:"m"},{ref:"fiat_twinair",p:85,box:"m"}]},
  {name:"500e (2020+)",alias:["500e","500 electrique"],seg:"electrique",y:[2020,2026],np:30000,eng:[{ref:"ev_psa",p:118,box:"a"}]},
  {name:"Panda III",alias:["panda"],seg:"citadine",y:[2012,2026],np:14000,eng:[{ref:"fiat_fire",p:70,box:"m"},{ref:"fiat_twinair",p:85,box:"m"}]}]},
{name:"Seat",alias:["seat","cupra"],tier:1,models:[
  {name:"Ibiza V",alias:["ibiza"],seg:"citadine",y:[2017,2026],np:20000,eng:[{ref:"vag_ea211",p:95,box:"ma",abox:"dq200"}]},
  {name:"Leon III/IV",alias:["leon","león"],seg:"compacte",y:[2013,2026],np:27000,eng:[{ref:"vag_ea211",p:130,box:"ma",abox:"dq200"},{ref:"vag_ea888",p:300,box:"a",abox:"dsg_wet",npx:1.35,segx:"sport"},{ref:"vag_ea288",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"Ateca",alias:["ateca"],seg:"suv",y:[2016,2026],np:31000,eng:[{ref:"vag_ea211",p:150,box:"ma",abox:"dsg_wet"},{ref:"vag_ea288",p:150,box:"ma",abox:"dsg_wet"}]}]},
{name:"Škoda",alias:["skoda","škoda"],tier:1,models:[
  {name:"Fabia III/IV",alias:["fabia"],seg:"citadine",y:[2014,2026],np:19000,eng:[{ref:"vag_ea211",p:95,box:"ma",abox:"dq200"}]},
  {name:"Octavia III/IV",alias:["octavia"],seg:"berline",y:[2013,2026],np:29000,eng:[{ref:"vag_ea211",p:150,box:"ma",abox:"dsg_wet"},{ref:"vag_ea288",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"Kodiaq",alias:["kodiaq"],seg:"suv",y:[2017,2026],np:38000,eng:[{ref:"vag_ea211",p:150,box:"ma",abox:"dsg_wet"},{ref:"vag_ea288",p:190,box:"a",abox:"dsg_wet"}]}]},
{name:"Hyundai",alias:["hyundai"],tier:1,models:[
  {name:"i10 III",alias:["i10"],seg:"citadine",y:[2020,2026],np:15000,eng:[{ref:"toy_atmo",p:67,box:"m"}]},
  {name:"i20 III",alias:["i20"],seg:"citadine",y:[2020,2026],np:18500,eng:[{ref:"hk_tgdi",p:100,box:"ma",abox:"dsg_wet"}]},
  {name:"i30 III",alias:["i30"],seg:"compacte",y:[2017,2026],np:25000,eng:[{ref:"hk_tgdi",p:120,box:"ma",abox:"dsg_wet"},{ref:"hk_crdi",p:136,box:"ma",abox:"dsg_wet"}]},
  {name:"Tucson IV",alias:["tucson"],seg:"suv",y:[2021,2026],np:36000,eng:[{ref:"hk_hev",p:230,box:"a"},{ref:"hk_tgdi",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"Kona",alias:["kona"],seg:"suv",y:[2017,2026],np:28000,eng:[{ref:"hk_tgdi",p:120,box:"ma",abox:"dsg_wet"},{ref:"hk_ev",p:204,box:"a"}]}]},
{name:"Kia",alias:["kia"],tier:1,models:[
  {name:"Picanto III",alias:["picanto"],seg:"citadine",y:[2017,2026],np:14500,eng:[{ref:"toy_atmo",p:67,box:"m"}]},
  {name:"Ceed III",alias:["ceed","cee'd"],seg:"compacte",y:[2018,2026],np:25000,eng:[{ref:"hk_tgdi",p:120,box:"ma",abox:"dsg_wet"},{ref:"hk_crdi",p:136,box:"ma",abox:"dsg_wet"}]},
  {name:"Sportage V",alias:["sportage"],seg:"suv",y:[2022,2026],np:37000,eng:[{ref:"hk_hev",p:230,box:"a"},{ref:"hk_tgdi",p:150,box:"ma",abox:"dsg_wet"}]},
  {name:"Niro II",alias:["niro","e-niro"],seg:"suv",y:[2016,2026],np:35000,eng:[{ref:"hk_hev",p:141,box:"a"},{ref:"hk_ev",p:204,box:"a"}]}]},
{name:"Volvo",alias:["volvo"],tier:2,models:[
  {name:"V40",alias:["v40"],seg:"compacte",y:[2012,2019],np:30000,eng:[{ref:"volvo_de",p:120,box:"ma",abox:"zf8"}]},
  {name:"XC40",alias:["xc40","xc 40"],seg:"suv",y:[2018,2026],np:44000,eng:[{ref:"volvo_de",p:163,box:"a",abox:"zf8"},{ref:"hk_ev",p:231,box:"a"}]},
  {name:"XC60 II",alias:["xc60","xc 60"],seg:"suv",y:[2017,2026],np:56000,eng:[{ref:"volvo_de",p:190,box:"a",abox:"zf8"}]}]},
{name:"Tesla",alias:["tesla"],tier:2,models:[
  {name:"Model 3",alias:["model 3","model3"],seg:"electrique",y:[2019,2026],np:47000,eng:[{ref:"tesla_3y",p:325,box:"a"}]},
  {name:"Model Y",alias:["model y","modely"],seg:"electrique",y:[2021,2026],np:50000,eng:[{ref:"tesla_3y",p:351,box:"a"}]},
  {name:"Model S",alias:["model s","models"],seg:"electrique",y:[2013,2026],np:95000,eng:[{ref:"tesla_s",p:428,box:"a"}]}]},
{name:"Alfa Romeo",alias:["alfa romeo","alfa","alfa-romeo"],tier:2,models:[
  {name:"Giulietta",alias:["giulietta"],seg:"compacte",y:[2010,2020],np:27000,eng:[{ref:"fiat_multiair",p:170,box:"m"},{ref:"fiat_mjet",p:120,box:"m"}]},
  {name:"Giulia",alias:["giulia"],seg:"berline",y:[2016,2026],np:45000,eng:[{ref:"alfa_22d",p:190,box:"a",abox:"zf8"},{ref:"alfa_veloce",p:280,box:"a",abox:"zf8"}]},
  {name:"Stelvio",alias:["stelvio"],seg:"suv",y:[2017,2026],np:50000,eng:[{ref:"alfa_22d",p:190,box:"a",abox:"zf8"},{ref:"alfa_veloce",p:280,box:"a",abox:"zf8"}]}]},
{name:"Jeep",alias:["jeep"],tier:1,models:[
  {name:"Renegade",alias:["renegade"],seg:"suv",y:[2014,2026],np:27000,eng:[{ref:"fiat_multiair",p:120,box:"m"},{ref:"fiat_mjet",p:120,box:"m"},{ref:"fiat_fire",p:101,box:"ma",abox:"dsg_wet"}]},
  {name:"Compass II",alias:["compass"],seg:"suv",y:[2017,2026],np:33000,eng:[{ref:"fiat_multiair",p:130,box:"ma"},{ref:"fiat_mjet",p:120,box:"m"}]}]},
{name:"Land Rover",alias:["land rover","landrover","range rover","range"],tier:2,models:[
  {name:"Range Rover Evoque",alias:["evoque"],seg:"suv",y:[2011,2026],np:48000,eng:[{ref:"jlr_ing_d",p:150,box:"a",abox:"zf8"},{ref:"jlr_ing_p",p:200,box:"a",abox:"zf8"}]},
  {name:"Discovery Sport",alias:["discovery sport","discovery"],seg:"suv",y:[2015,2026],np:48000,eng:[{ref:"jlr_ing_d",p:150,box:"a",abox:"zf8"}]}]},
{name:"Jaguar",alias:["jaguar"],tier:2,models:[
  {name:"XE",alias:["xe"],seg:"berline",y:[2015,2024],np:42000,eng:[{ref:"jlr_ing_d",p:180,box:"a",abox:"zf8"},{ref:"jlr_ing_p",p:200,box:"a",abox:"zf8"}]},
  {name:"F-Pace",alias:["f-pace","fpace"],seg:"suv",y:[2016,2026],np:58000,eng:[{ref:"jlr_ing_d",p:180,box:"a",abox:"zf8"},{ref:"jlr_ing_p",p:250,box:"a",abox:"zf8"}]}]},
{name:"Smart",alias:["smart"],tier:1,models:[
  {name:"Fortwo (453)",alias:["fortwo","for two"],seg:"citadine",y:[2014,2024],np:13500,eng:[{ref:"ren_tce90",p:90,box:"ma",abox:"edc"}]}]},
{name:"Porsche",alias:["porsche"],tier:2,models:[
  {name:"911 (991)",alias:["911","991"],seg:"sport",y:[2012,2019],np:115000,floor:.6,eng:[{ref:"por_flat6",p:400,box:"ma",abox:"pdk"}]},
  {name:"911 (992)",alias:["911","992"],seg:"sport",y:[2019,2026],np:135000,floor:.68,eng:[{ref:"por_flat6",p:450,box:"ma",abox:"pdk"}]},
  {name:"718 Cayman/Boxster",alias:["718","cayman","boxster"],seg:"sport",y:[2016,2026],np:65000,eng:[{ref:"por_flat4",p:300,box:"ma",abox:"pdk"},{ref:"por_flat6",p:400,box:"ma",abox:"pdk"}]},
  {name:"Macan",alias:["macan"],seg:"suv",y:[2014,2026],np:70000,eng:[{ref:"vag_ea888",p:245,box:"a",abox:"pdk"},{ref:"por_v6",p:354,box:"a",abox:"pdk"}]},
  {name:"Cayenne (E3)",alias:["cayenne"],seg:"suv",y:[2018,2026],np:90000,eng:[{ref:"por_v6",p:340,box:"a",abox:"zf8"}]},
  {name:"Panamera II",alias:["panamera"],seg:"berline",y:[2016,2026],np:105000,eng:[{ref:"por_v6",p:330,box:"a",abox:"pdk"}]},
  {name:"Taycan",alias:["taycan"],seg:"electrique",y:[2020,2026],np:110000,eng:[{ref:"por_ev",p:476,box:"a"}]}]},
{name:"Ferrari",alias:["ferrari"],tier:3,models:[
  {name:"458 Italia",alias:["458"],seg:"supercar",y:[2010,2015],np:240000,floor:.8,eng:[{ref:"fer_v8",p:570,box:"a",abox:"dsg_wet"}]},
  {name:"488 GTB",alias:["488"],seg:"supercar",y:[2015,2019],np:225000,floor:.8,eng:[{ref:"fer_v8",p:670,box:"a",abox:"dsg_wet"}]},
  {name:"Portofino",alias:["portofino","california"],seg:"supercar",y:[2017,2023],np:200000,floor:.65,eng:[{ref:"fer_v8",p:600,box:"a",abox:"dsg_wet"}]}]},
{name:"Lamborghini",alias:["lamborghini","lambo"],tier:3,models:[
  {name:"Gallardo",alias:["gallardo"],seg:"supercar",y:[2003,2013],np:195000,floor:.55,eng:[{ref:"lam_gallardo",p:560,box:"ma"}]},
  {name:"Huracán",alias:["huracan","huracán","lp580","lp610","evo"],seg:"supercar",y:[2014,2024],np:260000,floor:.68,eng:[{ref:"lam_huracan",p:610,box:"a"}]},
  {name:"Aventador",alias:["aventador"],seg:"supercar",y:[2011,2022],np:340000,floor:.75,eng:[{ref:"lam_v12",p:700,box:"a"}]},
  {name:"Urus",alias:["urus"],seg:"supercar",y:[2018,2026],np:230000,floor:.7,eng:[{ref:"lam_urus",p:650,box:"a",abox:"zf8"}]}]},
{name:"Maserati",alias:["maserati"],tier:3,models:[
  {name:"Ghibli III",alias:["ghibli"],seg:"berline",y:[2013,2023],np:78000,hold:.8,eng:[{ref:"mas_v6",p:350,box:"a",abox:"zf8"}]},
  {name:"Levante",alias:["levante"],seg:"suv",y:[2016,2023],np:88000,hold:.8,eng:[{ref:"mas_v6",p:350,box:"a",abox:"zf8"}]}]},
{name:"Aston Martin",alias:["aston martin","aston"],tier:3,models:[
  {name:"Vantage (2018+)",alias:["vantage"],seg:"supercar",y:[2018,2026],np:165000,eng:[{ref:"aston_v8",p:510,box:"a",abox:"zf8"}]},
  {name:"DB11",alias:["db11"],seg:"supercar",y:[2016,2023],np:210000,eng:[{ref:"aston_v8",p:535,box:"a",abox:"zf8"}]}]},
{name:"McLaren",alias:["mclaren","mc laren"],tier:3,models:[
  {name:"570S",alias:["570s","570"],seg:"supercar",y:[2015,2021],np:195000,hold:.72,eng:[{ref:"mcl_v8",p:570,box:"a"}]},
  {name:"720S",alias:["720s","720"],seg:"supercar",y:[2017,2023],np:250000,hold:.8,eng:[{ref:"mcl_v8",p:720,box:"a"}]}]},
{name:"Bentley",alias:["bentley"],tier:3,models:[
  {name:"Continental GT III",alias:["continental"],seg:"supercar",y:[2018,2026],np:235000,eng:[{ref:"bentley_w12",p:635,box:"a",abox:"zf8"}]}]}
];

/* Facteur d'entretien par marque (tier 1 = généraliste, 2 = premium, 3 = exotique) */
const TIER_MAINT = {1:1.0,2:1.45,3:3.2};
const TIER_INSUR = {1:1.0,2:1.2,3:2.6};
