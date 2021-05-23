import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-protest-welcome',
  templateUrl: './protest-welcome.component.html',
  styleUrls: ['./protest-welcome.component.scss'],
})
export class ProtestWelcomeComponent implements OnInit {
  data$;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const shareId = params.get('shareId');
      const protestId = params.get('protestId');

      const httpParams: HttpParams = new HttpParams()
        .set('shareId', shareId)
        .set('protestId', protestId);

      const baseUrl = `http://localhost:5000/protests/getProtestIfShareLinkIsValid`;

      this.data$ = this.http.get(`${baseUrl}`, { params: httpParams });
    });
  }

  onSubmit() {}
}
