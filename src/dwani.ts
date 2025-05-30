import { DwaniConfig } from './config/dwaniConfig';
import { Chat } from './modules/chat';
import { Vision } from './modules/vision';
import { ASR } from './modules/asr';
import { Audio } from './modules/audio';
import { Translate } from './modules/translate';
import { Documents } from './modules/documents';

export class Dwani {
  public Chat: Chat;
  public Vision: Vision;
  public ASR: ASR;
  public Audio: Audio;
  public Translate: Translate;
  public Documents: Documents;

  constructor() {
    const config = new DwaniConfig();
    this.Chat = new Chat(config);
    this.Vision = new Vision(config);
    this.ASR = new ASR(config);
    this.Audio = new Audio(config);
    this.Translate = new Translate(config);
    this.Documents = new Documents(config);
  }
}