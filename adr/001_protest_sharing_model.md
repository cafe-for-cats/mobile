# 1: Protest Sharing Model

## Status

Draft

## Context

We require an architectural model that allows users to:

- Share protests amongst themselves.
- Control the access rights of users coming in to the protest, and manage them afterwards.
- Have different application permissions specified for different access levels.

## Decision

We will do a tiered access level system, each level specifying a different use case and state of participation within a protest.

The tiers specifically will organized as such:

- Unassigned:
  - User that just joined a protest and is in a "waiting room" until an organizer or leader admits them to the protest.
  - Unassigned can:
    - View protest overview details.
- Attendee:
  - Attendees are participating in the protest and don't hold any higher organizational level role. They can only view places and announcements.
  - Attendees can:
    - View announcements.
    - View important locations.
    - Everything that an unassigned can.
- Organizer:
  - Organizers have elevated access within the protest because they're specifically helping to organize the event.
  - Organizers can:
    - Share the protest.
    - Add announcements and important locations.
    - Admit unassigned users to the protest as Attendees.
    - Everything that attendees, and an unassigned can.
- Leader:
  - Leaders create the protest and have overall administrative access over the users within.
  - Leaders can:
    - Manage individual access rights of users within a protest.
    - Everything that organizers, attendees, and an unassigned can.

## Consequences

With this tiered model, it will be easier to manage users as they navigate across protests.
