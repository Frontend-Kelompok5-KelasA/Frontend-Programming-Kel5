async function loadPageConfig(refs: any){
  const applyConf = (ref: any, comps: Record<string, string | number>) => {
    Object.entries(comps).forEach(([compId, data]: [string, string | number]) => {
      ref[compId] = data;
    })
  };

  const res = await fetch('/api/config/footer');

  const { config } = await res.json();
  if(!config)return;

  [
    [refs.desc.title, config.desc.title],
    [refs.desc.subtitle, config.desc.subtitle],
    [refs.tabs.home, config.tabs.home],
    [refs.tabs.explore, config.tabs.explore],
    [refs.tabs.favorite, config.tabs.favorite],
    [refs.tabs["about-us"], config.tabs["about-us"]],
    [refs.socials.email, config.socials.email],
    [refs.socials.instagram, config.socials.instagram],
    [refs.socials.whatsapp, config.socials.whatsapp],
    [refs.copyright, config.copyright.contents]
  ].forEach((e) => {
    if(!e[0])return;

    applyConf(e[0], e[1]);
  })
}

export async function onLoad(refs: any){
  loadPageConfig(refs);
}