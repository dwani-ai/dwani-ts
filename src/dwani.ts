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

  constructor(config?: DwaniConfig) {
    const dwaniConfig = config || new DwaniConfig();
    this.Chat = new Chat(dwaniConfig);
    this.Vision = new Vision(dwaniConfig);
    this.ASR = new ASR(dwaniConfig);
    this.Audio = new Audio(dwaniConfig);
    this.Translate = new Translate(dwaniConfig);
    this.Documents = new Documents(dwaniConfig);
  }
}