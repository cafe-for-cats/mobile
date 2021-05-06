import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  data: ArrayResource = [
    {'General Information': [{ infoName: 'What to expect at a protest', url: 'https://www.law.nyu.edu/centers/race-inequality-law/protest-tips' }]},
    {'Find Legal Resources': [{ infoName: 'NGL Legal Support Hotline', url: 'https://www.communityjusticeexchange.org/nbfn-directory' }, { infoName: 'National Bail Fund Network', url: 'https://www.nlg.org/massdefenseprogram/' }]},
    {'Support us': [{ infoName: 'GoFundMe', url: 'https://www.gofundme.com/f/help-build-a-protest-app' }]}
  ]

  constructor() { }
  ngOnInit() {}

  //delete later if unused and utilising ionic button href
  redirectTo(url){
    console.log(url)
    window.location.href=url
  }
}

//types and interfaces
type Resource = Record<string, Array<ResourceDesc>>
type ArrayResource = Array<Resource>

interface ResourceDesc {
  infoName: string
  url: string
}