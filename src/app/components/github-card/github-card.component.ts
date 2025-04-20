import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-github-card',
  standalone: true,
  imports: [],
  templateUrl: './github-card.component.html',
  styleUrl: './github-card.component.scss'
})
export class GithubCardComponent {
  @Input() user : string = '';
  @Input() repoName : string = '';
}
