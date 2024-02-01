import { Component } from '@angular/core';
import { School } from '../interface/school-interface';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.css'
})
export class SchoolsComponent {
  UAI_code = "0133774G";
  name = "Centrale Marseille"
  url = "https://www.centrale-marseille.fr/"
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  address = {
        street_address: "38 rue Frédéric-Joliot-Curie",
        postcode: 13451,
        locality: "Marseille CEDEX 13"
  }
  school_type = "Public"
  constructor() {}
}
