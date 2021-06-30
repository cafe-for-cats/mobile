# 1: Protest Sharing Model

## Status

Draft

## Context

We require an architectural model that allows users to:

- Share protests amongst themselves.
- Control the access rights of users coming in to the protest, and manage them afterwards.

## Decision

We will do a tiered access level system, each level specifying a different use case and state of participation within a protest.

The tiers specifically will organized as such:

- Unassigned (4):
  - User that just joined a protest and is in a "waiting room" until an organizer or leader admits them to the protest.
  - Unassigned can:
    - View protest overview details.
    - View an area map of the protest, not including locations at the protests placed by organizers and leaders of the protest.
    - Request higher-level access (?)
- Attendee (3):
  - Attendees are participating in the protest and don't hold any higher organizational level role. They can only view places and announcements.
  - Attendees can (including the rights of lower-tier access):
    - View announcements.
    - View important locations.
- Organizer (2):
  - Organizers have elevated access within the protest because they're specifically helping to organize the event.
  - Organizers can (including the rights of lower-tier access):
    - Share the protest.
    - Add announcements and important locations.
    - Admit unassigned users to the protest as Attendees.
    - Manage individual access rights of users within a protest.
    - Assign others to be organizers.
    - Organziers can vote on ending an event early (?)

## Consequences

With this tiered model, it will be easier to manage users as they navigate across protests.
