/**
 * Anti-abuse email guard for authentication flows.
 * Blocks disposable/temp-mail domains and '+' alias tricks across all domains.
 */

export type EmailValidationResult =
  | { valid: true; normalizedEmail: string }
  | { valid: false; error: string };

const DISPOSABLE_EMAIL_DOMAINS = new Set<string>([
  "10minutemail.com",
  "10minutemail.net",
  "10minutemail.org",
  "20minutemail.com",
  "33mail.com",
  "burnermail.com",
  "burnermail.io",
  "crazymailing.com",
  "discard.email",
  "discardmail.com",
  "disposableemailaddresses.com",
  "disposableinbox.com",
  "dispostable.com",
  "dropmail.me",
  "emailfake.com",
  "emailondeck.com",
  "emailsensei.com",
  "emailtemporanea.com",
  "emailtemporar.ro",
  "emltmp.com",
  "fakeinbox.com",
  "fakemail.net",
  "fakemailgenerator.com",
  "filzmail.com",
  "getairmail.com",
  "getnada.com",
  "grr.la",
  "guerrillamail.biz",
  "guerrillamail.com",
  "guerrillamail.de",
  "guerrillamail.info",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamailblock.com",
  "harakirimail.com",
  "hidemail.de",
  "inboxalias.com",
  "inboxkitten.com",
  "incognitomail.org",
  "instant-mail.de",
  "jetable.org",
  "koszmail.pl",
  "kurzepost.de",
  "linshi-email.com",
  "mail-temporaire.fr",
  "mailcatch.com",
  "maildrop.cc",
  "maildrop.cf",
  "maildx.com",
  "mailexpire.com",
  "mailforspam.com",
  "mailhazard.com",
  "mailimate.com",
  "mailinater.com",
  "mailinator.com",
  "mailinator.net",
  "mailinator.org",
  "mailinator2.com",
  "mailnesia.com",
  "mailnull.com",
  "mailpoof.com",
  "mailscrap.com",
  "mailshell.com",
  "mailsiphon.com",
  "mailtemp.info",
  "mailtothis.com",
  "mintemail.com",
  "minutemail.com",
  "moakt.com",
  "mohmal.com",
  "mt2015.com",
  "my10minutemail.com",
  "mytemp.email",
  "mytrashmail.com",
  "nada.email",
  "nada.ltd",
  "neomailbox.com",
  "no-spam.ws",
  "noclickemail.com",
  "nospam.ze.tc",
  "nowmymail.com",
  "objectmail.com",
  "oneoffemail.com",
  "owlymail.com",
  "pookmail.com",
  "proxymail.eu",
  "rcpt.at",
  "receiveee.com",
  "recode.me",
  "recursor.net",
  "regbypass.com",
  "rtrtr.com",
  "safetymail.info",
  "sendspamhere.com",
  "sharklasers.com",
  "shieldedmail.com",
  "slopsbox.com",
  "smellfear.com",
  "snakemail.com",
  "sneakemail.com",
  "spam4.me",
  "spamavert.com",
  "spambob.com",
  "spambog.com",
  "spambox.us",
  "spamcero.com",
  "spamday.com",
  "spamex.com",
  "spamfree24.org",
  "spamgourmet.com",
  "spamherelots.com",
  "spamhereplease.com",
  "spamhole.com",
  "spaml.com",
  "spammotel.com",
  "spamoff.de",
  "spamslicer.com",
  "spamspot.com",
  "spamthis.co.uk",
  "speed.1s.fr",
  "supergreatmail.com",
  "suremail.info",
  "temp-mail.com",
  "temp-mail.de",
  "temp-mail.io",
  "temp-mail.org",
  "temp-mail.ru",
  "tempail.com",
  "tempalias.com",
  "tempe-mail.com",
  "tempemail.biz",
  "tempemail.co.za",
  "tempemail.com",
  "tempemail.net",
  "tempinbox.co.uk",
  "tempinbox.com",
  "tempmail.com",
  "tempmail.de",
  "tempmail.dev",
  "tempmail.eu",
  "tempmail.net",
  "tempmail.org",
  "tempmail.plus",
  "tempmail2.com",
  "tempmailaddress.com",
  "tempmailer.com",
  "tempomail.fr",
  "temporarily.de",
  "temporarioemail.com.br",
  "temporaryemail.net",
  "temporaryforwarding.com",
  "temporaryinbox.com",
  "temporarymailaddress.com",
  "tempr.email",
  "tempsky.com",
  "thankyou2010.com",
  "thisisnotmyrealemail.com",
  "throwam.com",
  "throwawayemailaddress.com",
  "throwawaymail.com",
  "tmail.ws",
  "tmpmail.net",
  "tmpmail.org",
  "trash-mail.at",
  "trash-mail.com",
  "trash-mail.de",
  "trash2009.com",
  "trashemail.de",
  "trashmail.at",
  "trashmail.com",
  "trashmail.de",
  "trashmail.me",
  "trashmail.net",
  "trashmail.org",
  "trashmail.ws",
  "trashmailer.com",
  "trashymail.com",
  "trbvm.com",
  "twinmail.de",
  "tyldd.com",
  "uggsrock.com",
  "wegwerfemail.de",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "wegwerfmail.org",
  "wh4f.org",
  "wickmail.net",
  "wilemail.com",
  "willhackforfood.biz",
  "willselfdestruct.com",
  "winemaven.info",
  "wronghead.com",
  "wuzup.net",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
  "yuurok.com",
  "zehnminuten.de",
  "zippymail.info",
  "zoemail.org",
]);

const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isDisposableDomain(domain: string): boolean {
  const labels = domain.split(".");
  for (let i = 0; i <= labels.length - 2; i += 1) {
    const candidate = labels.slice(i).join(".");
    if (DISPOSABLE_EMAIL_DOMAINS.has(candidate)) {
      return true;
    }
  }
  return false;
}

/**
 * Normalizes and validates an authentication email address.
 * Rejects invalid formats, '+' alias tricks, and disposable/temp-mail domains.
 */
export function validateAuthEmail(email: string): EmailValidationResult {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !BASIC_EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      valid: false,
      error: "Please enter a valid work or personal email address.",
    };
  }

  const atIndex = normalizedEmail.indexOf("@");
  const localPart = normalizedEmail.slice(0, atIndex);
  const domain = normalizedEmail.slice(atIndex + 1);

  if (
    !localPart ||
    !domain ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
    return {
      valid: false,
      error: "Please enter a valid work or personal email address.",
    };
  }

  if (localPart.includes("+")) {
    return {
      valid: false,
      error:
        "Email aliases using '+' are not allowed. Please use your primary email address or sign in with Google.",
    };
  }

  if (isDisposableDomain(domain)) {
    return {
      valid: false,
      error:
        "Temporary or disposable email addresses are not allowed. Please use your work email or sign in with Google.",
    };
  }

  return { valid: true, normalizedEmail };
}
