import { Subject } from 'rxjs';

export const sectionNav$ = new Subject<string>();

export function scrollToSection(id: string): void {
  sectionNav$.next(id);
}

