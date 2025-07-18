// constants/programasPorNivel.js

export const getProgramOptions = (nivelEstudios) => {
  switch (nivelEstudios) {
    case 'SECUNDARIA':
      return ['SIU MULTICULTURAL', 'SIU BILINGÜE'];
    case 'BACHILLERATO':
      return ['BIU MULTICULTURAL', 'BIU BILINGÜE'];
    case 'UNIVERSIDAD':
      return [
        'Psicología (LPS)',
        'Derecho (LED)',
        'Pedagogía (LPE)',
        'Ciencias Políticas y Gestión Pública (LCP)',
        'Relaciones Internacionales (LRI)',
        'Relaciones Internacionales y Economía (RIEC)',
        'Relaciones Internacionales y Ciencias Políticas (RICP)',
        'Idiomas (LID)',
        'Comunicación (LCO)',
        'Comunicación y Relaciones Públicas (CORP)',
        'Comercio Exterior (LCE)',
        'Economía y Finanzas (LEF)',
        'Mercadotecnia (LEM)',
        'Mercadotecnia y Publicidad (LEMP)',
        'Psicología Organizacional (LPO)',
        'Administración de Empresas Turísticas (LAET)',
        'Administración de Empresas (LAE)',
        'Administración de Negocios Internacionales (LANI)',
        'Administración Pública (LAP)',
        'Administración y Mercadotecnia (LAM)',
        'Diseño de Modas y Tendencias Internacionales (LDM)',
        'Diseño Industrial (LDI)',
        'Diseño Gráfico (LDG)',
        'Animación y Diseño Digital (LADD)',
        'Arquitectura (ARQ)',
        'Civil (ICI)',
        'Mecatrónica (IME)',
        'Mecánica Industrial (IMI)',
        'Industrial y de Sistemas de Calidad (IISCA)',
        'Sistemas Computacionales (ISC)',
        'Ambiental (IAM)',
        'Gestión Empresarial (LEGE)',
        'Mercadotecnia (LEMK)',
        'Administración de Negocios Internacionales (LEANI)',
        'Mercadotecnia y Publicidad (LEMKP)',
        'Comercio Exterior (LECE)',
      ];
    case 'POSGRADO':
      return [
        'Maestría en Administración y Dirección de Empresas (MADE)',
        'Especialidad en Marketing Digital (EMD)',
        'Doctorado en Administración',
        'Especialidad en Criminalística (EC)',
        'Especialidad en Relaciones Mercantiles Internacionales (ERMI)',
        'Especialidad en Promoción Turística (EPT)',
        'Especialidad en Publicidad (EPU)',
        'Especialidad en Administración de la Tecnología en Línea (EATL)',
        'Especialidad en Administración de Obra (EAO)',
        'Especialidad en Animación y Post-Producción Digital (EAPD)',
        'Maestría en Línea de Administración y Dirección de Empresas (MADEL)',
        'Maestría en Administración con Especialidad en Negocios Internacionales (MAD)',
        'Maestría en Alta Dirección (MADIR)',
        'Maestría en Finanzas Corporativas (MFC)',
        'Maestría en Gestión de la Calidad (MGC)',
        'Maestría en Gestión del Factor y Capital Humano (MGFH)',
        'Maestría en Impuestos (MI)',
        'Maestría en Mercadotecnia Global (MMG)',
        'Maestría en Educación en Formación Docente (MEFD)',
        'Maestría en Enseñanza de Lenguas Extranjeras (MEL)',
        'Maestría en Redes de Computadoras y Tecnologías WEB (MARET)',
        'Doctorado en Humanidades',
      ];
    default:
      return [];
  }
};
