import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { scrollToSection } from '../../shared/section-navigation';

type Theme = 'dark' | 'light';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  readonly navLinks = [
    { id: 'home',    label: 'Home'     },
    { id: 'about',   label: 'About'    },
    { id: 'resume',  label: 'Resume'   },
    { id: 'project', label: 'Projects' },
    { id: 'service', label: 'Skills'   },
    { id: 'blog',    label: 'Blog'     },
    { id: 'contact', label: 'Contact'  },
  ];

  theme: Theme = 'dark';
  isMenuOpen = false;

  @Input() activeSection = 'home';

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme | null;
    this.theme = savedTheme === 'light' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', this.theme);
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', this.theme);
    document.body.setAttribute('data-theme', this.theme);
  }

  goTo(event: Event, id: string): void {
    event.preventDefault();
    this.isMenuOpen = false;
    this.activeSection = id;
    scrollToSection(id);
  }
}

