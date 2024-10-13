# Overview

This is a simple side project to simulate and visualize drone pathing on a map. Currently, this is limited to simple geocoordinates and speed but does not factor in altitude, acceleration, etc.

# Requirements

THis package utilizes sst dev and aws. You will need set up an aws account.
This package also utilizes the aws iot core mqtt broker which relies on a lambda function for authorization. This has been commented out but can be implemented by setting the RT_TOKEN token using `bun sst secret`.

The cost to run this is non-zero but minimal, depending on your usage.

# Local Dev

bun install && bun sst dev
